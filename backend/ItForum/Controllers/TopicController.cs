using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
using ItForum.Services;
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

        public TopicController(TopicService topicService, UnitOfWork unitOfWork, IMapper mapper,
            UserService userService)
        {
            _topicService = topicService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userService = userService;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet]
        public IActionResult GetAllParent()
        {
            var topics = _topicService.FindParentWithSubTopicsAndThreads().ToList();
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
        public IActionResult GetParentOptions()
        {
            var topics = _topicService.FindParent();
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

        [HttpGet("threads-created/{id}")]
        public IActionResult GetWithThreadsCreatedBy(int id)
        {
            var topic = _topicService.FindWithThreadsCreatedBy(id);
            topic.Threads.RemoveAll(th => th.ApprovalStatus == ApprovalStatus.Declined);

            if (User.Identity.IsAuthenticated)
            {
                var user = _userService.FindById(CurrentUserId);

                if (user.Role == Role.None)
                    topic.Threads.RemoveAll(th =>
                        th.ApprovalStatus == ApprovalStatus.Pending && th.CreatedById != CurrentUserId);
            }
            else
            {
                topic.Threads.RemoveAll(th => th.ApprovalStatus == ApprovalStatus.Pending);
            }

            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }
    }
}