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
        public IActionResult GetWithCreatedByTagsAndReplies(int id)
        {
            var thread = _threadService.FindWithCreatedByTagsAndReplies(id);

            if (User.Identity.IsAuthenticated)
            {
                thread.Posts = thread.Posts.Where(x => x.ParentId == null).Where(x =>
                    x.ApprovalStatus == ApprovalStatus.Approved ||
                    x.ApprovalStatus == ApprovalStatus.Pending && x.CreatedById == CurrentUserId).ToList();
                thread.Posts.ForEach(p => p.Replies = p.Replies.Where(x =>
                    x.ApprovalStatus == ApprovalStatus.Approved ||
                    x.ApprovalStatus == ApprovalStatus.Pending && x.CreatedById == CurrentUserId).ToList());
            }
            else
            {
                thread.Posts = thread.Posts.Where(x => x.ParentId == null)
                    .Where(x => x.ApprovalStatus == ApprovalStatus.Approved).ToList();
                thread.Posts.ForEach(p =>
                    p.Replies = p.Replies.Where(x => x.ApprovalStatus == ApprovalStatus.Approved).ToList());
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
            if (thread.Posts[0] == null) return BadRequest();

            thread.CreatedById = CurrentUserId;
            thread.LastActivity = DateTime.Now;
            thread.ThreadTags = new List<ThreadTag>();
            threadDto.Tags.ForEach(t => thread.ThreadTags.Add(new ThreadTag {TagId = t.Id}));

            var post = thread.Posts[0];
            post.CreatedById = CurrentUserId;
            _userService.SelfApprovePost(CurrentUserId, ref post, ref thread);
            thread.Posts[0] = post;

            var topic = _topicService.FindById(thread.TopicId);
            topic.NumberOfThreads += 1;

            await _threadService.AddAsync(thread);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, thread);
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