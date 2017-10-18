namespace ItForum.Data.Domains
{
    public class CommentVote : Vote
    {
        public int CommentId { get; set; }

        public Comment Comment { get; set; }
    }
}