using System;
using System.Collections.Generic;
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
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    public class PostController : Controller
    {
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly UnitOfWork _unitOfWork;

        public PostController(IMapper mapper, PostService postService, ThreadService threadService,
            UnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _postService = postService;
            _threadService = threadService;
            _unitOfWork = unitOfWork;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet]
        public IActionResult GetAll()
        {
            var comments = _postService.GetAll();
            var dto = _mapper.Map<List<PostDto>>(comments);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var comment = _postService.FindById(id);
            if (comment == null)
                return NotFound();
            var dto = _mapper.Map<PostDto>(comment);
            return Ok(dto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post post)
        {
            if (post == null)
                return BadRequest();

            post.CreatedById = CurrentUserId;
            await _postService.AddAsync(post);
            var thread = _threadService.FindById(post.ThreadId);
            thread.LastActivity = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();

            post = _postService.FindById(post.Id);
            var dto = _mapper.Map<PostDto>(post);
            return StatusCode(StatusCodes.Status201Created, dto);
        }
    }
}