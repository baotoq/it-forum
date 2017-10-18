using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
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
        public IActionResult GetAll()
        {
            var topics = _topicService.GetAll().ToList();
            var dto = _mapper.Map<List<TopicDto>>(topics);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var topic = _topicService.FindById(id);
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Topic topic)
        {
            if (topic == null)
                return BadRequest();

            await _topicService.AddAsync(topic);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(201, topic);
        }
    }
}