using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Thread : ThreadEntity
    {
        [ForeignKey(nameof(CreatedById))]
        public User CreatedBy { get; set; }

        [ForeignKey(nameof(TopicId))]
        public Topic Topic { get; set; }

        public List<Post> Posts { get; set; }

        [ForeignKey(nameof(ApprovalStatusModifiedById))]
        public User ApprovalStatusModifiedBy { get; set; }

        public List<ThreadTag> ThreadTags { get; set; }
    }
}