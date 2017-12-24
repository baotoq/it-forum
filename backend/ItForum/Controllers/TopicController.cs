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
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet]
        public IActionResult GetAll(int level = 0)
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == level).ToList();
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("subs")]
        public IActionResult GetAllWithSubTopics(int level = 0)
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == level, "SubTopics").ToList();
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("subs/{id}")]
        public IActionResult GetWithSubTopics(int id)
        {
            var topic = _topicService.FindWithSubTopics(id);
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [HttpGet("parent-options")]
        public IActionResult GetParentOptions(int level = 0)
        {
            var topics = _topicService.Find(level);
            return Ok(topics.Select(x => new
            {
                value = x.Id,
                text = x.Name,
                title = x.Description
            }));
        }

        [HttpGet("sub-options/{id}")]
        public IActionResult GetSubOptions(int id)
        {
            var topics = _topicService.FindWithSubTopics(id);
            return Ok(topics.SubTopics.Select(x => new
            {
                value = x.Id,
                text = x.Name,
                title = x.Description
            }));
        }

        [HttpGet("managements/{id}")]
        public IActionResult GetWithManagements(int id)
        {
            var topic = _topicService.FindWithManaments(id);
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [HttpGet("default-threads/{id}")]
        public IActionResult GetDefaultThreads(int id)
        {
            var threads = _topicService.FindTopicThreadsWithPosts(id).ToList();

            threads.RemoveAll(th => th.ApprovalStatus == ApprovalStatus.Declined);

            if (User.Identity.IsAuthenticated)
            {
                var user = _userService.FindById(CurrentUserId);

                if (user.Role == Role.None)
                    threads.RemoveAll(th =>
                        th.ApprovalStatus == ApprovalStatus.Pending && th.CreatedById != CurrentUserId);
            }
            else
            {
                threads.RemoveAll(th => th.ApprovalStatus == ApprovalStatus.Pending);
            }

            var dto = _mapper.Map<List<ThreadDto>>(threads);

            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("approved-threads/{id}")]
        public IActionResult GetApprovedThreads(int id)
        {
            var threads = _topicService.FindTopicThreadsWithPosts(id).ToList();

            threads = threads.Where(p => p.ApprovalStatus == ApprovalStatus.Approved).ToList();

            var dto = _mapper.Map<List<ThreadDto>>(threads);

            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("pending-threads/{id}")]
        public IActionResult GetPendingThreads(int id)
        {
            var threads = _topicService.FindTopicThreads(id);

            threads = threads.Where(p => p.ApprovalStatus == ApprovalStatus.Pending);

            var dto = _mapper.Map<List<ThreadDto>>(threads.ToList());
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("declined-threads/{id}")]
        public IActionResult GetDeclinedThreads(int id)
        {
            var threads = _topicService.FindTopicThreads(id);

            threads = threads.Where(p => p.ApprovalStatus == ApprovalStatus.Declined);

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
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var topic = _topicService.FindById(id);
            if (topic == null) return BadRequest();
            _topicService.Remove(topic);
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
    }
}