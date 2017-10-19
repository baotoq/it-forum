using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Topic : TopicEntity
    {
        public List<Thread> Threads { get; set; }

        public Category Category { get; set; }
    }
}