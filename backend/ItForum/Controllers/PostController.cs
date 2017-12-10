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
        private readonly HelperService _helperService;
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public PostController(IMapper mapper, PostService postService, ThreadService threadService,
            UnitOfWork unitOfWork, UserService userService, HelperService helperService)
        {
            _mapper = mapper;
            _postService = postService;
            _threadService = threadService;
            _unitOfWork = unitOfWork;
            _userService = userService;
            _helperService = helperService;
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

            post.ApprovalStatusModifiedById = CurrentUserId;
            post.ApprovalStatus = approvalStatus;

            var thread = _threadService.FindById(post.ThreadId);

            if (approvalStatus == ApprovalStatus.Approved) thread.NumberOfPosts += 1;
            else thread.NumberOfPosts -= 1;

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("vote")]
        public async Task<IActionResult> Vote([FromBody] Vote vote)
        {
            var message = vote.Like ? "up" : "down";
            vote.UserId = CurrentUserId;
            var oldVote = _postService.FindVote(vote.PostId, vote.UserId);

            if (oldVote == null)
            {
                _postService.Add(vote);
            }
            else if (oldVote.Like != vote.Like)
            {
                oldVote.Like = vote.Like;
            }
            else
            {
                message = "remove";
                _postService.Remove(oldVote);
                await _unitOfWork.SaveChangesAsync();
            }

            var post = _postService.FindWithVotes(vote.PostId);
            post.Point = _helperService.CaculatePoint(post.Votes);

            await _unitOfWork.SaveChangesAsync();

            return Ok(new {message, post.Point});
        }
    }
}