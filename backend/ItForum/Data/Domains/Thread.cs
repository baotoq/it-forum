using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Thread : ThreadEntity
    {
        public User CreatedBy { get; set; }

        public Topic Topic { get; set; }

        public List<Post> Posts { get; set; }

        public List<ThreadTag> ThreadTags { get; set; }
    }
}