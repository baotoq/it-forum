namespace ItForum.Data.Entities
{
    public abstract class PostEntity : Entity
    {
        public string Content { get; set; }

        public int ThreadId { get; set; }

        public int UserId { get; set; }
    }
}