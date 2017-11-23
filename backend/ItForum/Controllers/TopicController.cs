using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;
using System;

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

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var topic = _topicService.FindById(id);
            if (topic == null)
                return NotFound();
            var dto = _mapper.Map<TopicDto>(topic);
            return Ok(dto);
        }

        [HttpGet]
        public IActionResult GetSelectOptions()
        {
            var topics = _topicService.GetAll().ToList();
            return Ok(topics.Select(x => new
            {
                value = x.Id,
                text = x.Name,
                title = x.Description
            }));
        }

        [HttpGet]
        public IActionResult GetThreadStatistic()
        {
            var topics = _topicService.GetAll();
            return Ok(topics.Select(t => new
            {
                name = t.Name,
                numberOfThreads = t.Discussions.Sum(d => d.Threads.Count),
            }).OrderByDescending(x => x.numberOfThreads).Take(10));
        }

        [HttpGet]
        public IActionResult GetPostStatistic()
        {
            var topics = _topicService.GetAllWithPost();
            return Ok(topics.Select(t => new
            {
                name = t.Name,
                numberOfPosts = t.Discussions.Sum(d => d.Threads.Sum(th => th.Posts.Count))
            }).OrderByDescending(x => x.numberOfPosts).Take(10));
        }
    }
}