using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class User : UserEntity
    {
        public List<Thread> Threads { get; set; }

        public List<Post> Posts { get; set; }

        public User ApprovedBy { get; set; }
    }
}