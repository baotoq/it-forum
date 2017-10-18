using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class User : UserEntity
    {
        public List<Post> Posts { get; set; }

        public List<PostVote> PostVotes { get; set; }

        public List<Comment> Comments { get; set; }

        public List<CommentVote> CommentVotes { get; set; }

        public int? ConfirmedById { get; set; }

        public User ConfirmedBy { get; set; }
    }
}