using System;
using System.Linq;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
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

        [HttpGet]
        [Route("threads-per-topic")]
        public IActionResult ThreadsPerTopic()
        {
            var topics = _topicService.GetAll();
            return Ok(topics.Select(t => new
            {
                Key = t.Name,
                Value = t.Discussions.Sum(d => d.Threads.Count)
            }).OrderByDescending(x => x.Value));
        }

        [HttpGet]
        [Route("posts-per-topic")]
        public IActionResult PostsPerTopic()
        {
            var topics = _topicService.GetAllWithPost();
            return Ok(topics.Select(t => new
            {
                Key = t.Name,
                Value = t.Discussions.Sum(d => d.Threads.Sum(th => th.Posts.Count))
            }).OrderByDescending(x => x.Value));
        }

        [HttpGet]
        [Route("threads-per-month")]
        public IActionResult ThreadsPerMonth()
        {
            var threads = _threadService.GetAll();
            var group = threads.GroupBy(x => new DateTime(x.CreatedDate.Value.Year, x.CreatedDate.Value.Month, 1))
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

        [HttpGet]
        [Route("posts-per-month")]
        public IActionResult PostsPerMonth()
        {
            var posts = _postService.GetAll();
            var group = posts.GroupBy(x => new DateTime(x.CreatedDate.Value.Year, x.CreatedDate.Value.Month, 1))
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