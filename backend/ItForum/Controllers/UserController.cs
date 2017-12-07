using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class UserController : Controller
    {
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public UserController(UserService userService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user == null) return BadRequest();

            var innerUser = _userService.FindBy(user.Email, user.Password);
            if (innerUser == null) return StatusCode(StatusCodes.Status401Unauthorized, "Invalid email or password!");
            if (innerUser.ApprovedById == null)
                return StatusCode(StatusCodes.Status401Unauthorized, "You need to be approved by admin!");

            var token = _userService.GenerateJwt(innerUser);

            return Ok(new {token});
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null) return BadRequest();

            if (_userService.IsExistEmail(user.Email)) return BadRequest();

            user.Role = Role.None;
            await _userService.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, user);
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var user = _userService.FindById(id);
            var dto = _mapper.Map<UserDto>(user);
            return Ok(dto);
        }

        [HttpPost("exist-email")]
        public IActionResult IsExistEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest();
            return Ok(_userService.IsExistEmail(email));
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("unapprove")]
        public IActionResult GetUnapprove()
        {
            return Ok(_userService.GetUnapprove().ToList());
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("approve")]
        public async Task<IActionResult> Approve([FromBody] Payload payload)
        {
            var response = new List<int>();
            foreach (int id in payload.Data)
            {
                var user = _userService.FindById(id);
                if (user != null && user.ApprovedBy == null)
                {
                    user.ApprovedById = CurrentUserId;
                    response.Add(id);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok(response);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("decline")]
        public async Task<IActionResult> Decline([FromBody] Payload payload)
        {
            var response = new List<int>();
            foreach (int id in payload.Data)
            {
                var user = _userService.FindById(id);
                if (user != null && user.ApprovedBy == null)
                {
                    _userService.Remove(user);
                    response.Add(id);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok(response);
        }
    }
}