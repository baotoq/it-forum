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
    public class ThreadController : Controller
    {
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly TopicService _topicService;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public ThreadController(ThreadService threadService, UnitOfWork unitOfWork, IMapper mapper,
            TopicService topicService, UserService userService, PostService postService)
        {
            _threadService = threadService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _topicService = topicService;
            _userService = userService;
            _postService = postService;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet("created-tags-replies/{id}")]
        public IActionResult GetWithCreatedByTagsAndRepliesAsync(int id)
        {
            var thread = _threadService.FindWithCreatedByTagsAndReplies(id);

            thread.Posts.RemoveAll(p => p.ParentId != null || p.ApprovalStatus == ApprovalStatus.Declined);

            thread.Posts.ForEach(p => p.Replies.RemoveAll(r => r.ApprovalStatus == ApprovalStatus.Declined));

            if (User.Identity.IsAuthenticated)
            {
                var user = _userService.FindById(CurrentUserId);

                if (user.Role == Role.None)
                {
                    var predicate = new Predicate<Post>(p =>
                        p.ApprovalStatus == ApprovalStatus.Pending && p.CreatedById != CurrentUserId);

                    thread.Posts.RemoveAll(predicate);
                    thread.Posts.ForEach(p => p.Replies.RemoveAll(predicate));
                }
            }
            else
            {
                var predicate = new Predicate<Post>(p => p.ApprovalStatus == ApprovalStatus.Pending);

                thread.Posts.RemoveAll(predicate);
                thread.Posts.ForEach(p => p.Replies.RemoveAll(predicate));
            }

            var dto = _mapper.Map<ThreadDto>(thread);
            return Ok(dto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ThreadDto threadDto)
        {
            var thread = _mapper.Map<Thread>(threadDto);

            if (thread == null) return BadRequest();
            if (thread.TopicId == null) return BadRequest();
            if (thread.Posts[0] == null) return BadRequest();

            thread.CreatedById = CurrentUserId;
            thread.Posts[0].CreatedById = CurrentUserId;
            thread.LastActivity = DateTime.Now;
            thread.NumberOfPosts = 1;
            thread.ThreadTags = new List<ThreadTag>();
            threadDto.Tags.ForEach(t => thread.ThreadTags.Add(new ThreadTag {TagId = t.Id}));

            var createdBy = _userService.FindById(CurrentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
                SetApprovalStatus(thread, ApprovalStatus.Approved);

            await _threadService.AddAsync(thread);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, thread);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("pending")]
        public IActionResult GetPendingThreads()
        {
            var threads = _threadService.FindPending().ToList();
            var dto = _mapper.Map<List<ThreadDto>>(threads);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var thread = _threadService.FindWithPosts(id);
            if (thread == null) return BadRequest();

            var currentUser = _userService.FindById(CurrentUserId);

            if (currentUser.Role == Role.Administrator)
            {
                SetApprovalStatus(thread, ApprovalStatus.Approved);
            }
            else
            {
                var moderators = _userService.FindModerators(thread.TopicId.Value).ToList();
                if (moderators.Any(u => u.Id == currentUser.Id))
                    SetApprovalStatus(thread, ApprovalStatus.Approved);
                return new ForbidResult();
            }

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("decline/{id}")]
        public async Task<IActionResult> Decline(int id)
        {
            var thread = _threadService.FindWithPosts(id);
            if (thread == null) return BadRequest();

            var currentUser = _userService.FindById(CurrentUserId);

            if (currentUser.Role == Role.Administrator)
            {
                SetApprovalStatus(thread, ApprovalStatus.Declined);
            }
            else
            {
                var moderators = _userService.FindModerators(thread.TopicId.Value).ToList();
                if (moderators.Any(u => u.Id == currentUser.Id))
                    SetApprovalStatus(thread, ApprovalStatus.Declined);
                return new ForbidResult();
            }

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        private void SetApprovalStatus(Thread thread, ApprovalStatus approvalStatus)
        {
            if (thread.ApprovalStatus == ApprovalStatus.Pending)
            {
                _threadService.SetApprovalStatus(CurrentUserId, thread, approvalStatus);
                _postService.SetApprovalStatus(CurrentUserId, thread.Posts[0], approvalStatus);
                if (approvalStatus == ApprovalStatus.Approved)
                    _topicService.IncreaseNumberOfThreads(thread.TopicId);
            }
        }

        [HttpPost("view/{id}")]
        public async Task<IActionResult> View(int id)
        {
            var thread = _threadService.FindById(id);
            if (thread == null) return BadRequest();
            thread.Views += 1;
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
    }
}