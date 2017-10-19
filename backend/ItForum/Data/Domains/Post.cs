using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Post : PostEntity
    {
        public Thread Thread { get; set; }

        public User User { get; set; }
    }
}