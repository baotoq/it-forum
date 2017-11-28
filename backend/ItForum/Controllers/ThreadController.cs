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
        private readonly UnitOfWork _unitOfWork;

        public ThreadController(ThreadService threadService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _threadService = threadService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet]
        public IActionResult GetAll()
        {
            var threads = _threadService.GetAll().ToList();
            var dto = _mapper.Map<List<ThreadDto>>(threads);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var thread = _threadService.FindById(id);
            if (thread == null) return BadRequest();
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
            thread.Posts[0].CreatedById = CurrentUserId;
            thread.LastActivity = DateTime.Now;
            thread.ThreadTags = new List<ThreadTag>();
            threadDto.Tags.ForEach(t => thread.ThreadTags.Add(new ThreadTag {TagId = t.Id}));

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