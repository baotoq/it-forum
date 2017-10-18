namespace ItForum.Data.Entities
{
    public abstract class TopicEntity : Entity
    {
        public string Name { get; set; }

        public string Description { get; set; }
    }
}