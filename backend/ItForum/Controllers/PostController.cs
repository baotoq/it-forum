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

            var thread = _threadService.FindById(post.ThreadId);

            if (thread.ApprovalStatus != ApprovalStatus.Approved) return BadRequest();

            thread.LastActivity = DateTime.Now;

            post.CreatedById = CurrentUserId;
            var createdBy = _userService.FindById(CurrentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
            {
                _postService.SetApprovalStatus(CurrentUserId, post, ApprovalStatus.Approved);
                thread.NumberOfPosts += 1;
            }

            await _postService.AddAsync(post);
            await _unitOfWork.SaveChangesAsync();

            post = _postService.FindWithCreatedBy(post.Id);
            var dto = _mapper.Map<PostDto>(post);

            return StatusCode(StatusCodes.Status201Created, dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("pending")]
        public IActionResult GetPendingPosts()
        {
            var posts = _postService.FindPending().ToList();
            var dto = _mapper.Map<List<PostDto>>(posts);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var post = _postService.FindWithThread(id);
            if (post == null) return BadRequest();

            if (post.ApprovalStatus == ApprovalStatus.Pending && post.Thread.ApprovalStatus == ApprovalStatus.Approved)
            {
                _postService.SetApprovalStatus(CurrentUserId, post, ApprovalStatus.Approved);
                _threadService.IncreaseNumberOfPosts(post.ThreadId);
            }

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("decline/{id}")]
        public async Task<IActionResult> Decline(int id)
        {
            var post = _postService.FindWithThread(id);
            if (post == null) return BadRequest();

            if (post.ApprovalStatus == ApprovalStatus.Pending && post.Thread.ApprovalStatus == ApprovalStatus.Approved)
                _postService.SetApprovalStatus(CurrentUserId, post, ApprovalStatus.Declined);

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