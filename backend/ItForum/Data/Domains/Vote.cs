using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public abstract class Vote : VoteEntity
    {
        public int UserId { get; set; }

        public User User { get; set; }
    }
}