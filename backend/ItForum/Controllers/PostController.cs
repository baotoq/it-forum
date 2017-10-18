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
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    public class PostController : Controller
    {
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly UnitOfWork _unitOfWork;

        public PostController(PostService postService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _postService = postService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _postService.GetAll().ToList();
            var dto = _mapper.Map<List<PostDto>>(posts);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var post = _postService.FindById(id);
            var dto = _mapper.Map<PostDto>(post);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post post)
        {
            if (post == null) return BadRequest();

            post.UserId = CurrentUserId;
            post.LastActivity = DateTime.Now;
            await _postService.AddAsync(post);
            await _unitOfWork.SaveChangesAsync();

            return StatusCode(201, post);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> View(int id)
        {
            var post = _postService.FindById(id);
            if (post == null) return BadRequest();
            post.Views += 1;
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Vote([FromBody] PostVote vote)
        {
            var message = vote.Liked ? "up" : "down";
            vote.UserId = CurrentUserId;
            var oldVote = _postService.FindVote(vote.PostId, vote.UserId);

            if (oldVote == null)
            {
                _postService.Add(vote);
            }
            else if (oldVote.Liked != vote.Liked)
            {
                oldVote.Liked = vote.Liked;
            }
            else
            {
                message = "remove";
                _postService.Remove(oldVote);
                await _unitOfWork.SaveChangesAsync();
            }

            var point = 0;
            var post = _postService.FindById(vote.PostId);
            post.PostVotes.ForEach(x =>
            {
                if (x.Liked) point++;
                else point--;
            });
            await _unitOfWork.SaveChangesAsync();

            return Ok(new {message, point});
        }
    }
}