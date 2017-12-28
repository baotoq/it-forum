using System;
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

        [HttpGet("created-tags/{id}")]
        public IActionResult GetWithCreatedByAndTags(int id)
        {
            var thread = _threadService.FindWithCreatedByAndTags(id);

            var dto = _mapper.Map<ThreadDto>(thread);
            return Ok(dto);
        }

        [Authorize]
        [HttpGet("approved-pending-posts-replies/{id}")]
        public IActionResult GetApprovedPendingPostsWithReplies(int id)
        {
            var posts = _threadService.FindThreadPostsWithReplies(id).ToList();

            posts.RemoveAll(p => p.ParentId != null || p.ApprovalStatus == ApprovalStatus.Declined);

            posts.ForEach(p => p.Replies.RemoveAll(r => r.ApprovalStatus == ApprovalStatus.Declined));

            var user = _userService.FindById(CurrentUserId);

            if (user.Role == Role.None)
            {
                var predicate = new Predicate<Post>(p =>
                    p.ApprovalStatus == ApprovalStatus.Pending && p.CreatedById != CurrentUserId);

                posts.RemoveAll(predicate);
                posts.ForEach(p => p.Replies.RemoveAll(predicate));
            }

            var dto = _mapper.Map<List<PostDto>>(posts);
            return Ok(dto);
        }

        [HttpGet("approved-posts-replies/{id}")]
        public IActionResult GetApprovedPostsWithReplies(int id)
        {
            var posts = _threadService.FindThreadPostsWithReplies(id).ToList();

            posts.RemoveAll(p => p.ParentId != null || p.ApprovalStatus != ApprovalStatus.Approved);
            posts.ForEach(p => p.Replies.RemoveAll(r => r.ApprovalStatus != ApprovalStatus.Approved));

            var dto = _mapper.Map<List<PostDto>>(posts);
            return Ok(dto);
        }

        [Authorize]
        [HttpGet("pending-posts/{id}")]
        public IActionResult GetPendingPosts(int id)
        {
            var posts = _threadService.FindThreadPosts(id);

            var user = _userService.FindById(CurrentUserId);

            if (user.Role != Role.None)
                posts = posts.Where(p => p.ApprovalStatus == ApprovalStatus.Pending);
            else
                posts = posts.OrderByDescending(x => x.DateCreated).Take(1);

            var dto = _mapper.Map<List<PostDto>>(posts.ToList());
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("declined-posts/{id}")]
        public IActionResult GetDeclinedPosts(int id)
        {
            var posts = _threadService.FindThreadPosts(id);

            posts = posts.Where(p => p.ApprovalStatus == ApprovalStatus.Declined);

            var dto = _mapper.Map<List<PostDto>>(posts.ToList());
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("count-pendings/{id}")]
        public IActionResult CountPendings(int id)
        {
            return Ok(_threadService.CountPendings(id));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ThreadDto threadDto)
        {
            var thread = _mapper.Map<Thread>(threadDto);

            if (thread == null) return BadRequest();
            if (thread.TopicId == null) return BadRequest();
            if (thread.Posts[0] == null) return BadRequest();

            thread.Title = thread.Title.Trim();
            thread.CreatedById = CurrentUserId;
            thread.Posts[0].CreatedById = CurrentUserId;
            thread.LastActivity = DateTime.Now;
            thread.NumberOfPosts = 1;
            thread.ThreadTags = new List<ThreadTag>();
            threadDto.Tags.ForEach(t => thread.ThreadTags.Add(new ThreadTag { TagId = t.Id }));

            var createdBy = _userService.FindById(CurrentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
                SetApprovalStatus(thread, ApprovalStatus.Approved);

            await _threadService.AddAsync(thread);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, thread);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var thread = _threadService.FindWithPosts(id);

            if (thread == null) return BadRequest();
            if (thread.ApprovalStatus == ApprovalStatus.Approved) return Ok();

            if (!HasPermission(thread.TopicId.Value))
                return Forbid();

            SetApprovalStatus(thread, ApprovalStatus.Approved);

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("decline/{id}")]
        public async Task<IActionResult> Decline(int id)
        {
            var thread = _threadService.FindWithPosts(id);

            if (thread == null) return BadRequest();
            if (thread.ApprovalStatus == ApprovalStatus.Declined) return Ok();

            if (!HasPermission(thread.TopicId.Value))
                return Forbid();

            SetApprovalStatus(thread, ApprovalStatus.Declined);

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        private void SetApprovalStatus(Thread thread, ApprovalStatus approvalStatus)
        {
            _threadService.SetApprovalStatus(CurrentUserId, thread, approvalStatus);
            _postService.SetApprovalStatus(CurrentUserId, thread.Posts[0], approvalStatus);
            if (approvalStatus == ApprovalStatus.Approved)
                _topicService.IncreaseNumberOfThreads(thread.TopicId);
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

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpPost("pin/{id}")]
        public async Task<IActionResult> Pin(int id, bool pin)
        {
            var thread = _threadService.FindById(id);
            if (thread == null) return BadRequest();

            if (!HasPermission(thread.TopicId.Value))
                return Forbid();

            thread.Pin = pin;

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("move/{id}")]
        public async Task<IActionResult> Move(int id, int topicId)
        {
            var thread = _threadService.FindById(id);

            thread.TopicId = topicId;

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchModel payload)
        {
            
            var threads = _threadService.FindBy(payload.SearchString, payload.TopicId, payload.Tags, payload.TitleOnly);

            var dto = _mapper.Map<List<ThreadDto>>(threads.ToList());

            return Ok(dto);
        }

    

        private bool HasPermission(int topicId)
        {
            var currentUser = _userService.FindById(CurrentUserId);
            if (currentUser.Role == Role.Moderator)
                if (!_userService.IsManagement(topicId, currentUser.Id))
                    return false;
            return true;
        }

        public class SearchModel
        {
            public string SearchString { get; set; }

            public int TopicId { get; set; }

            public List<int> Tags { get; set; }

            public bool TitleOnly { get; set; }
        }
    }
}