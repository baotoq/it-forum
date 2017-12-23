using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet]
        public IActionResult GetAllWithSubTopicsAndThreads(int level = 0)
        {
            var topics = _topicService.FindWithSubTopicsAndThreads(level).ToList();
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("sub-topics/{id}")]
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

        [HttpGet("all-sub-topics")]
        public IActionResult GetAllSubTopics()
        {
            var topics = _topicService.FindByNoTracking(x => x.Parent != null).ToList();
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("threads-created/{id}")]
        public IActionResult GetWithThreadsCreatedBy(int id)
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

            for (int i = 0; i < dto.Count; i++)
            {
                dto[i].NumberOfPendings = threads[i].Posts.Count(x => x.ApprovalStatus == ApprovalStatus.Pending);
                dto[i].Posts.Clear();
            }

            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator) + "," + nameof(Role.Moderator))]
        [HttpGet("approved-threads/{id}")]
        public IActionResult GetApprovedThreads(int id)
        {
            var threads = _topicService.FindTopicThreadsWithPosts(id).ToList();

            threads = threads.Where(p => p.ApprovalStatus == ApprovalStatus.Approved).ToList();

            var dto = _mapper.Map<List<ThreadDto>>(threads);

            for (int i = 0; i < dto.Count; i++)
            {
                dto[i].NumberOfPendings = threads[i].Posts.Count(x => x.ApprovalStatus == ApprovalStatus.Pending);
                dto[i].Posts.Clear();
            }

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
    }
}