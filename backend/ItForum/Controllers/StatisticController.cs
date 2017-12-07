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
            var threads = _threadService.FindAll("Topic");
            return Ok(threads.GroupBy(x => x.Topic.Name).Select(x => new
            {
                x.Key,
                Value = x.Count()
            }).OrderBy(x => x.Value));
        }

        [HttpGet("posts-per-topic")]
        public IActionResult PostsPerTopic()
        {
            var posts = _postService.FindAll("Thread.Topic");
            return Ok(posts.GroupBy(x => x.Thread.Topic.Name).Select(x => new
            {
                x.Key,
                Value = x.Count()
            }).OrderBy(x => x.Value));
        }

        [HttpGet("threads-per-month")]
        public IActionResult ThreadsPerMonth()
        {
            var threads = _threadService.FindAll();
            return Ok(threads.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    Key = new
                    {
                        x.Key.Year,
                        x.Key.Month
                    },
                    Value = x.Count()
                }).OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month));
        }

        [HttpGet("posts-per-month")]
        public IActionResult PostsPerMonth()
        {
            var posts = _postService.FindAll();
            return Ok(posts.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    Key = new
                    {
                        x.Key.Year,
                        x.Key.Month
                    },
                    Value = x.Count()
                }).OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month));
        }
    }
}