using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Post : PostEntity
    {
        [ForeignKey(nameof(ThreadId))]
        public Thread Thread { get; set; }

        [ForeignKey(nameof(CreatedById))]
        public User CreatedBy { get; set; }

        [ForeignKey(nameof(PostId))]
        public List<Post> Replies { get; set; }
    }
}