using System;
using System.Collections.Generic;
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
    public class CommentController : Controller
    {
        private readonly CommentService _commentService;
        private readonly IMapper _mapper;
        private readonly PostService _postService;
        private readonly UnitOfWork _unitOfWork;

        public CommentController(IMapper mapper, CommentService commentService, PostService postService,
            UnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _commentService = commentService;
            _postService = postService;
            _unitOfWork = unitOfWork;
        }

        public int CurrentUserId => int.Parse(User.FindFirst("id").Value);

        [HttpGet]
        public IActionResult GetAll()
        {
            var comments = _commentService.GetAll();
            var dto = _mapper.Map<List<CommentDto>>(comments);
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var comment = _commentService.FindById(id);
            var dto = _mapper.Map<CommentDto>(comment);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Comment comment)
        {
            if (comment == null)
                return BadRequest();

            comment.UserId = CurrentUserId;
            await _commentService.AddAsync(comment);
            var post = _postService.FindById(comment.PostId);
            post.LastActivity = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();

            comment = _commentService.FindById(comment.Id);
            var dto = _mapper.Map<CommentDto>(comment);
            return StatusCode(201, dto);
        }

        [HttpPost]
        public async Task<IActionResult> Vote([FromBody] CommentVote vote)
        {
            var message = vote.Liked ? "up" : "down";
            vote.UserId = CurrentUserId;
            var oldVote = _commentService.FindVote(vote.CommentId, vote.UserId);

            if (oldVote == null)
            {
                _commentService.Add(vote);
            }
            else if (oldVote.Liked != vote.Liked)
            {
                oldVote.Liked = vote.Liked;
            }
            else
            {
                message = "remove";
                _commentService.Remove(oldVote);
                await _unitOfWork.SaveChangesAsync();
            }

            var point = 0;
            var comment = _commentService.FindById(vote.CommentId);
            comment.CommentVotes.ForEach(x =>
            {
                if (x.Liked) point++;
                else point--;
            });
            await _unitOfWork.SaveChangesAsync();

            return Ok(new {message, point});
        }
    }
}