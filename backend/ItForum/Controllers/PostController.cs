using System;
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
            if (thread.Locked) return BadRequest();

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

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var post = _postService.FindWithThread(id);

            if (post == null) return BadRequest();
            if (post.Thread.ApprovalStatus != ApprovalStatus.Approved) return BadRequest();

            if (post.ApprovalStatus == ApprovalStatus.Approved) return Ok();

            if (!HasPermission(post.Thread.TopicId.Value))
                return Forbid();

            _postService.SetApprovalStatus(CurrentUserId, post, ApprovalStatus.Approved);
            _threadService.IncreaseNumberOfPosts(post.ThreadId);

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("decline/{id}")]
        public async Task<IActionResult> Decline(int id)
        {
            var post = _postService.FindWithThread(id);

            if (post == null) return BadRequest();
            if (post.Thread.ApprovalStatus != ApprovalStatus.Approved) return BadRequest();

            if (post.ApprovalStatus == ApprovalStatus.Declined) return Ok();
            
            if (!HasPermission(post.Thread.TopicId.Value))
                return Forbid();

            _postService.SetApprovalStatus(CurrentUserId, post, ApprovalStatus.Declined);

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("vote")]
        public async Task<IActionResult> Vote([FromBody] Vote vote)
        {
            var post = _postService.FindWithVotes(vote.PostId);
            if (post.CreatedById == CurrentUserId) return BadRequest();

            var message = vote.Like ? "up" : "down";
            vote.UserId = CurrentUserId;
            var oldVote = post.Votes.SingleOrDefault(p => p.UserId == vote.UserId);

            if (oldVote == null)
            {
                post.Votes.Add(vote);
            }
            else if (oldVote.Like != vote.Like)
            {
                oldVote.Like = vote.Like;
            }
            else
            {
                message = "remove";
                post.Votes.Remove(oldVote);
            }

            post.Point = _helperService.CaculatePoint(post.Votes);

            await _unitOfWork.SaveChangesAsync();

            return Ok(new {message, post.Point});
        }

        private bool HasPermission(int topicId)
        {
            var currentUser = _userService.FindById(CurrentUserId);
            if (currentUser.Role == Role.Moderator)
                if (!_userService.IsManagement(topicId, currentUser.Id))
                    return false;
            return true;
        }
    }
}