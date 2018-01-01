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
    public class TopicController : Controller
    {
        private readonly IMapper _mapper;
        private readonly TopicService _topicService;
        private readonly UnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public TopicController(IMapper mapper, TopicService topicService, UserService userService,
            UnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _userService = userService;
            _topicService = topicService;
            _unitOfWork = unitOfWork;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet("sub-threads")]
        public IActionResult GetAllWithSubTopicsAndThreads(int level = 0)
        {
            var topics = _topicService.FindWithSubTopicsAndThreads(level).ToList();
            topics.ForEach(t => t.SubTopics = t.SubTopics.Where(x => x.DateDeleted == null).ToList());
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet]
        public IActionResult GetAll(int level = 0)
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == level && x.DateDeleted == null);
            var dto = _mapper.Map<List<TopicDto>>(topics.ToList());
            return Ok(dto);
        }

        [HttpGet("subs")]
        public IActionResult GetAllWithSubTopics(int level = 0)
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == level && x.DateDeleted == null, "SubTopics").ToList();
            topics.ForEach(t => t.SubTopics = t.SubTopics.Where(x => x.DateDeleted == null).ToList());
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpGet("deleted/subs")]
        public IActionResult GetAllDeleted()
        {
            var topics = _topicService.FindByNoTracking(x => x.DateDeleted != null, "SubTopics").ToList();
            topics.ForEach(t => t.SubTopics = t.SubTopics.Where(x => x.DateDeleted == null).ToList());
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("subs/{id}")]
        public IActionResult GetWithSubTopics(int id)
        {
            var topic = _topicService.FindWithSubTopics(id);
            topic.SubTopics = topic.SubTopics.Where(x => x.DateDeleted == null).ToList();
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [HttpGet("managements/{id}")]
        public IActionResult GetWithManagements(int id)
        {
            var topic = _topicService.FindWithManaments(id);
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("threads/{id}")]
        public IActionResult GetApprovedThreads(int id, ApprovalStatus approvalStatus)
        {
            var threads = _topicService.FindTopicThreads(id, approvalStatus);

            var dto = _mapper.Map<List<ThreadDto>>(threads.ToList());

            return Ok(dto);
        }

        [HttpGet("approved-pending-threads/{id}")]
        public IActionResult GetApprovedAndUserPendingThreads(int id)
        {
            IEnumerable<Thread> threads;

            if (User.Identity.IsAuthenticated)
                threads = _topicService.FindTopicThreads(id)
                    .Where(p => p.ApprovalStatus == ApprovalStatus.Approved ||
                                p.ApprovalStatus == ApprovalStatus.Pending &&
                                p.CreatedById == CurrentUserId);
            else
                threads = _topicService.FindTopicThreads(id, ApprovalStatus.Approved);

            var dto = _mapper.Map<List<ThreadDto>>(threads.ToList());

            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Topic topic)
        {
            if (topic == null) return BadRequest();
            _topicService.Add(topic);
            await _unitOfWork.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created, topic);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] Topic payload)
        {
            var topic = _topicService.FindById(payload.Id);
            if (topic == null) return BadRequest();

            topic.Name = payload.Name;
            topic.Description = payload.Description;

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("restore/{id}")]
        public async Task<IActionResult> Restore(int id)
        {
            var topic = _topicService.FindById(id);
            if (topic == null) return BadRequest();
            topic.DateDeleted = null;
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpDelete("{id}")]
        public async Task<IActionResult> SafeDelete(int id)
        {
            var topic = _topicService.FindById(id);
            if (topic == null) return BadRequest();
            topic.DateDeleted = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }


        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpDelete("permanently/{id}")]
        public async Task<IActionResult> PermanentlyDelete(int id)
        {
            var topic = _topicService.FindDeletedWithSubTopics(id);
            if (topic == null) return BadRequest();
            topic.SubTopics.ForEach(t => _topicService.Remove(t));
            _topicService.Remove(topic);
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("re-order")]
        public async Task<IActionResult> ReOrder([FromBody] Topic topic)
        {
            topic.SubTopics.ForEach(s =>
            {
                var t = _topicService.FindById(s.Id);
                t.OrderIndex = s.OrderIndex;
            });
            await _unitOfWork.SaveChangesAsync();
            return Ok(topic);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost("move/{id}")]
        public async Task<IActionResult> Move(int id, int parentId)
        {
            var topic = _topicService.FindById(id);
            if (topic == null) return BadRequest();
            topic.ParentId = parentId;
            topic.OrderIndex = int.MaxValue;
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
    }
}