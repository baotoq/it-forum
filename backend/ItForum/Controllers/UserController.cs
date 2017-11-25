using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    public class UserController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public UserController(UserService userService, UnitOfWork unitOfWork)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] User user)
        {
            if (user == null) return BadRequest();

            var innerUser = _userService.FindBy(user.Email, user.Password);
            if (innerUser == null) return StatusCode(401, "Invalid email or password!");
            if (innerUser.ConfirmedById == null) return StatusCode(401, "Confirmation is required!");

            var token = _userService.GenerateJwt(innerUser);

            return Ok(new {token});
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (user == null) return BadRequest();

            if (_userService.HasEmail(user.Email)) return Ok(new {error = "Existed"});

            user.Role = Role.User;
            await _userService.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(201, user);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_userService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            return Ok(_userService.FindById(id));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost]
        public bool HasEmail(string email)
        {
            return !string.IsNullOrEmpty(email) && _userService.HasEmail(email);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet]
        public IActionResult GetUnconfirmed()
        {
            return Ok(_userService.GetUnconfirmed());
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost]
        public async Task<IActionResult> Confirm([FromBody] Payload payload)
        {
            var response = new List<int>();
            foreach (var id in ((IEnumerable) payload.Data).Cast<object>().Select(x => int.Parse(x.ToString())))
            {
                var user = _userService.FindById(id);
                if (user != null && user.ConfirmedBy == null)
                {
                    user.ConfirmedById = CurrentUserId;
                    response.Add(id);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok(response);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost]
        public async Task<IActionResult> Deny([FromBody] Payload payload)
        {
            var response = new List<int>();
            foreach (var id in ((IEnumerable) payload.Data).Cast<object>().Select(x => int.Parse(x.ToString())))
            {
                var user = _userService.FindById(id);
                if (user != null && user.ConfirmedBy == null)
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