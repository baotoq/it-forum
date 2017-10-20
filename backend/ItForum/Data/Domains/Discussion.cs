using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Discussion : DiscussionEntity
    {
        public List<Thread> Threads { get; set; }

        public Topic Topic { get; set; }
    }
}