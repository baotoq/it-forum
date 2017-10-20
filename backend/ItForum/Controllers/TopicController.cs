using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
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
    }
}