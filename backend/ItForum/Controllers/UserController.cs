using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
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
using MoreLinq;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class UserController : Controller
    {
        private readonly EmailSender _emailSender;
        private readonly HelperService _helperService;
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public UserController(UserService userService, UnitOfWork unitOfWork, IMapper mapper,
            HelperService helperService, EmailSender emailSender)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _helperService = helperService;
            _emailSender = emailSender;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user == null) return BadRequest();

            var innerUser = _userService.FindBy(user.Email.ToLower());

            if (innerUser == null || innerUser.Password != _helperService.Hash(user.Password, innerUser.Salt))
                return StatusCode(StatusCodes.Status401Unauthorized, "Invalid email or password!");

            switch (innerUser.ApprovalStatus)
            {
                case ApprovalStatus.Approved:
                    var token = _userService.GenerateJwt(innerUser);
                    return Ok(new {token});
                case ApprovalStatus.Pending:
                    return StatusCode(StatusCodes.Status403Forbidden, "You need to be approved by admin!");
                case ApprovalStatus.Declined:
                    return BadRequest("Your registration has been declined!");
                default:
                    return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null) return BadRequest();

            if (_userService.IsExistEmail(user.Email)) return BadRequest();

            user.Role = Role.None;
            user.Email = user.Email.ToLower();
            user.Salt = _helperService.CreateSalt();
            user.Password = _helperService.Hash(user.Password, user.Salt);

            await _userService.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, user);
        }

        [HttpGet("reputations/{id}")]
        public IActionResult GetWithReputations(int id)
        {
            var user = _userService.FindById(id);
            var dto = _mapper.Map<UserDto>(user);
            _userService.CaculateReputationsNumberOfPostsThreads(user.Id, dto);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var user = _userService.FindById(id);
            var dto = _mapper.Map<UserDto>(user);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("managements/{id}")]
        public IActionResult GetWithManagements(int id)
        {
            var user = _userService.FindNoTrackingWithManagements(id);
            var dto = _mapper.Map<UserDto>(user);
            _userService.CaculateReputationsNumberOfPostsThreads(user.Id, dto);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("managements/{id}")]
        public async Task<IActionResult> EditUserManagements(int id, [FromBody] Payload payload)
        {
            var user = _userService.FindWithManagements(id);
            if (user == null) return BadRequest();
            if (user.Role != Role.Moderator) return BadRequest();

            user.Managements.Clear();
            await _unitOfWork.SaveChangesAsync();

            foreach (var topicId in payload.Data)
                user.Managements.Add(new Management {TopicId = topicId});

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("role/{id}")]
        public async Task<IActionResult> EditRole(int id, [FromQuery] Role role)
        {
            var user = _userService.FindWithManagements(id);
            if (user == null) return BadRequest();
            user.Role = role;
            if (role != Role.Moderator)
                user.Managements.Clear();
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("exist-email")]
        public IActionResult IsExistEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest();
            return Ok(_userService.IsExistEmail(email.ToLower()));
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("approval-status")]
        public IActionResult GetByApprovalStatus([FromQuery] ApprovalStatus approvalStatus)
        {
            var dto = _mapper.Map<List<UserDto>>(_userService.FindByNoTracking(approvalStatus).ToList());
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("approve")]
        public async Task<IActionResult> Approve([FromBody] Payload payload)
        {
            var response = new List<int>();
            foreach (int id in payload.Data)
            {
                var user = _userService.FindById(id);
                if (user != null && user.ApprovalStatus == ApprovalStatus.Pending)
                {
                    user.ApprovalStatusModifiedById = CurrentUserId;
                    user.ApprovalStatus = ApprovalStatus.Approved;
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
                if (user != null && user.ApprovalStatus == ApprovalStatus.Pending)
                {
                    user.ApprovalStatusModifiedById = CurrentUserId;
                    user.ApprovalStatus = ApprovalStatus.Declined;
                    response.Add(id);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok(response);
        }

        [HttpGet("moderators/{topicId}")]
        public IActionResult GetModerators(int topicId)
        {
            var moderators = _userService.FindModerators(topicId).ToList();
            var dto = _mapper.Map<List<User>>(moderators);
            return Ok(dto);
        }

        [HttpGet("posts/{id}")]
        public IActionResult GetUserPosts(int id)
        {
            var posts = _userService.FindUserPosts(id, ApprovalStatus.Approved);
            var dto = _mapper.Map<List<PostDto>>(posts.ToList());
            return Ok(dto);
        }

        [HttpGet("threads/{id}")]
        public IActionResult GetUserThreads(int id)
        {
            var threads = _userService.FindUserThreadsWithPostsAndTopic(id, ApprovalStatus.Approved);
            threads.ForEach(t =>
            {
                var temp = t.Posts.OrderByDescending(p => p.CreatedBy).FirstOrDefault();
                t.Posts.Clear();
                t.Posts.Add(temp);
            });
            var dto = _mapper.Map<List<ThreadDto>>(threads);
            return Ok(dto);
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> Forgot(string email)
        {
            var user = _userService.FindBy(email.ToLower());

            if (user == null) return BadRequest();

            var token = _userService.GenerateForgotPasswordJwt(user);
            var callbackUrl = $"http://tdtgame.azurewebsites.net/auth/reset?token={token}";

            await _emailSender.SendEmailAsync(email, "Reset Password",
                $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");

            return Ok();
        }

        [HttpPost("validate-token")]
        public IActionResult ValidateToken(string token)
        {
            try
            {
                if (_userService.ValidateToken(token) is JwtSecurityToken decodedToken)
                {
                    var claim = decodedToken.Claims.FirstOrDefault(c => c.Type == "action");
                    if (claim?.Value == "forgot")
                        return Ok(decodedToken.Payload);
                }

                return BadRequest();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpPost("reset-password/{id}")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] PasswordPayload payload)
        {
            if (ValidateToken(payload.Token) is BadRequestResult) return BadRequest();

            var user = _userService.FindById(id);
            user.Salt = _helperService.CreateSalt();
            user.Password = _helperService.Hash(payload.Password, user.Salt);
            await _unitOfWork.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordPayload payload)
        {
            if (string.IsNullOrEmpty(payload.NewPassword)) return BadRequest();

            var user = _userService.FindById(CurrentUserId);
            if (user == null || user.Password != _helperService.Hash(payload.Password, user.Salt))
                return StatusCode(StatusCodes.Status401Unauthorized, "Invalid email or password!");

            user.Salt = _helperService.CreateSalt();
            user.Password = _helperService.Hash(payload.NewPassword, user.Salt);

            await _unitOfWork.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] User payload)
        {
            if (payload == null) return BadRequest();

            var user = _userService.FindById(CurrentUserId);
            user.Name = payload.Name;
            user.Phone = payload.Phone;
            user.Birthdate = payload.Birthdate;

            await _unitOfWork.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            var user = _userService.FindById(CurrentUserId);
            var filePath = $"/{ConstantPath.Avatar}/{DateTime.Now.ToFileTime()}_{file.FileName}";
            using (var stream = new FileStream($"{ConstantPath.Root}{filePath}", FileMode.Create))
            {
                var path = $"{ConstantPath.Root}{user.Avatar}";
                if (System.IO.File.Exists(path)) System.IO.File.Delete(path);

                await file.CopyToAsync(stream);
                user.Avatar = $"{filePath}";
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok(user.Avatar);
        }
    }

    public class PasswordPayload
    {
        public string Token { get; set; }

        public string Password { get; set; }

        public string NewPassword { get; set; }
    }

    public class AvartarPayload
    {
        public IFormFile File { get; set; }
    }
}