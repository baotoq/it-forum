namespace ItForum.Data.Domains
{
    public class Vote
    {
        public bool Like { get; set; }

        public int PostId { get; set; }

        public Post Post { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }
    }
}