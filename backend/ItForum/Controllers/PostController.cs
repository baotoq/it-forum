using System;
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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post post)
        {
            if (post == null) return BadRequest();
            if (post.ThreadId == null) return BadRequest();

            post.CreatedById = CurrentUserId;
            post.Quotes = post.Quotes?.Select(item => _postService.FindById(item.Id)).Where(p => p != null).ToList();
            await _postService.AddAsync(post);

            var thread = _threadService.FindById(post.ThreadId);
            thread.LastActivity = DateTime.Now;

            await _unitOfWork.SaveChangesAsync();

            post = _postService.FindWithCreatedByAndQuotes(post.Id);
            var dto = _mapper.Map<PostDto>(post);
            return StatusCode(StatusCodes.Status201Created, dto);
        }
    }
}