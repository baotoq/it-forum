using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
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

        public TopicController(TopicService topicService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _topicService = topicService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

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
            if (topic == null)
                return BadRequest();
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
        public IActionResult GetWithThreadsAndCreatedBy(int id)
        {
            var topic = _topicService.FindWithThreadsAndCreatedBy(id);
            if (topic == null)
                return BadRequest();
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }
    }
}