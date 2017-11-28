using System;
using System.Linq;
using ItForum.Data.Domains;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public class StatisticController : Controller
    {
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly TopicService _topicService;

        public StatisticController(TopicService topicService, ThreadService threadService, PostService postService)
        {
            _topicService = topicService;
            _threadService = threadService;
            _postService = postService;
        }

        [HttpGet("threads-per-topic")]
        public IActionResult ThreadsPerTopic()
        {
            var topics = _topicService.FindAll("Threads");
            return Ok(topics.Select(t => new
            {
                Key = t.Name,
                Value = t.Threads.Count
            }).OrderByDescending(x => x.Value));
        }

        [HttpGet("posts-per-topic")]
        public IActionResult PostsPerTopic()
        {
            var topics = _topicService.FindAll("Threads.Posts");
            return Ok(topics.Select(t => new
            {
                Key = t.Name,
                Value = t.Threads.Sum(d => d.Posts.Count)
            }).OrderByDescending(x => x.Value));
        }

        [HttpGet("threads-per-month")]
        public IActionResult ThreadsPerMonth()
        {
            var threads = _threadService.FindAll();
            var group = threads.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    x.Key,
                    Value = x.Count()
                }).OrderByDescending(x => x.Key);
            return Ok(group.Select(x => new
            {
                Key = x.Key.ToString("Y"),
                x.Value
            }));
        }

        [HttpGet("posts-per-month")]
        public IActionResult PostsPerMonth()
        {
            var posts = _postService.FindAll();
            var group = posts.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    x.Key,
                    Value = x.Count()
                }).OrderByDescending(x => x.Key);
            return Ok(group.Select(x => new
            {
                Key = x.Key.ToString("Y"),
                x.Value
            }));
        }
    }
}