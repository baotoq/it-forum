namespace ItForum.Data.Entities
{
    public abstract class DiscussionEntity : Entity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public int TopicId { get; set; }
    }
}