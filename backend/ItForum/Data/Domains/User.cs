using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class User : UserEntity
    {
        public List<Topic> Topics { get; set; }

        public List<Thread> Threads { get; set; }

        public List<Post> Posts { get; set; }

        public List<Post> ApprovalStatusModifiedPosts { get; set; }

        public List<Thread> ApprovalStatusModifiedThreads { get; set; }

        [ForeignKey(nameof(ApprovalStatusModifiedById))]
        public User ApprovalStatusModifiedBy { get; set; }

        public List<Vote> Votes { get; set; }

        public List<Management> Managements { get; set; }
    }
}