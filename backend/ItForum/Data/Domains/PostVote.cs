namespace ItForum.Data.Domains
{
    public class PostVote : Vote
    {
        public int PostId { get; set; }

        public Post Post { get; set; }
    }
}