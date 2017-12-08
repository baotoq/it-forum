using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Topic : TopicEntity
    {
        [ForeignKey(nameof(CreatedById))]
        public User CreatedBy { get; set; }

        public List<Thread> Threads { get; set; }

        [ForeignKey(nameof(ParentId))]
        public Topic Parent { get; set; }

        [ForeignKey(nameof(ParentId))]
        public List<Topic> SubTopics { get; set; }
    }
}