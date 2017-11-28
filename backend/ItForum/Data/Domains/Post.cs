using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Post : PostEntity
    {
        public Thread Thread { get; set; }

        public User CreatedBy { get; set; }

        public List<Post> Replies { get; set; }
    }
}