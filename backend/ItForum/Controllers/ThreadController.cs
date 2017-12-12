using System;
using System.Collections.Generic;
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
        private readonly ThreadService _threadService;
        private readonly TopicService _topicService;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public ThreadController(ThreadService threadService, UnitOfWork unitOfWork, IMapper mapper,
            TopicService topicService, UserService userService)
        {
            _threadService = threadService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _topicService = topicService;
            _userService = userService;
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
            thread.ThreadTags = new List<ThreadTag>();
            threadDto.Tags.ForEach(t => thread.ThreadTags.Add(new ThreadTag {TagId = t.Id}));

            var createdBy = _userService.FindById(CurrentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
            {
                thread.Posts[0].ApprovalStatusModifiedBy = createdBy;
                thread.Posts[0].ApprovalStatus = ApprovalStatus.Approved;
                thread.NumberOfPosts += 1;

                _topicService.IncreaseNumberOfThreads(thread.TopicId);
            }

            await _threadService.AddAsync(thread);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, thread);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var thread = _threadService.FindWithPosts(id);
            if (thread == null) return BadRequest();

            if (thread.ApprovalStatus == ApprovalStatus.Pending || thread.ApprovalStatus == ApprovalStatus.Declined)
            {
                thread.ApprovalStatusModifiedById = CurrentUserId;
                thread.ApprovalStatus = ApprovalStatus.Approved;
                _topicService.IncreaseNumberOfThreads(thread.TopicId);

                if (thread.Posts.Count == 1)
                {
                    thread.Posts[0].ApprovalStatusModifiedById = CurrentUserId;
                    thread.Posts[0].ApprovalStatus = ApprovalStatus.Approved;

                    thread.NumberOfPosts += 1;
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return Ok();
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