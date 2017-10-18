using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Topic : TopicEntity
    {
        public List<Post> Posts { get; set; }
    }
}