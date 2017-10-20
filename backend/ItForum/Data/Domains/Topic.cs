using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Topic : TopicEntity
    {
        public List<Discussion> Discussions { get; set; }
    }
}