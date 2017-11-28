﻿using System.Collections.Generic;
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
    public class DiscussionController : Controller
    {
        private readonly DiscussionService _discussionService;
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public DiscussionController(DiscussionService discussionService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _discussionService = discussionService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var discussions = _discussionService.FindAll().ToList();
            var dto = _mapper.Map<List<DiscussionDto>>(discussions);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var discussion = _discussionService.FindById(id);
            if (discussion == null) return BadRequest();
            var dto = _mapper.Map<DiscussionDto>(discussion);
            return Ok(dto);
        }

        [HttpGet("select-options/{topicId}")]
        public IActionResult GetSelectOptions(int topicId)
        {
            var discussions = _discussionService.FinByTopic(topicId);
            return Ok(discussions.Select(x => new
            {
                value = x.Id,
                text = x.Name,
                title = x.Description
            }));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Discussion discussion)
        {
            if (discussion == null) return BadRequest();

            await _discussionService.AddAsync(discussion);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, discussion);
        }
    }
}