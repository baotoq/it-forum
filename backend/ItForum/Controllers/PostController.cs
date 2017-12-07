using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
    public class PostController : Controller
    {
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public PostController(IMapper mapper, PostService postService, ThreadService threadService,
            UnitOfWork unitOfWork, UserService userService)
        {
            _mapper = mapper;
            _postService = postService;
            _threadService = threadService;
            _unitOfWork = unitOfWork;
            _userService = userService;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post post)
        {
            if (post == null) return BadRequest();
            if (post.ThreadId == null) return BadRequest();

            post.CreatedById = CurrentUserId;
            await _postService.AddAsync(post);

            var thread = _threadService.FindById(post.ThreadId);
            thread.LastActivity = DateTime.Now;

            _userService.SelfApprovePost(CurrentUserId, ref post, ref thread);

            await _unitOfWork.SaveChangesAsync();

            post = _postService.FindWithCreatedBy(post.Id);
            var dto = _mapper.Map<PostDto>(post);
            return StatusCode(StatusCodes.Status201Created, dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("pending")]
        public IActionResult GetPendingPosts()
        {
            var posts = _postService.GetPending().ToList();
            var dto = _mapper.Map<List<PostDto>>(posts);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("modify-approval-status/{id}")]
        public async Task<IActionResult> ModifyApprovalStatus(int id, [FromQuery] ApprovalStatus approvalStatus)
        {
            var post = _postService.FindById(id);
            if (post == null) return BadRequest();
            if (post.ApprovalStatus == ApprovalStatus.Pending)
            {
                post.ApprovalStatusModifiedById = CurrentUserId;
                post.ApprovalStatus = approvalStatus;

                var thread = _threadService.FindById(post.ThreadId);
                thread.NumberOfPosts += 1;

                await _unitOfWork.SaveChangesAsync();
            }
            return Ok();
        }
    }
}