using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Topic : TopicEntity
    {
        public User CreatedBy { get; set; }

        public List<Discussion> Discussions { get; set; }
    }
}