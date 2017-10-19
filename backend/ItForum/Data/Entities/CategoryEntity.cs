namespace ItForum.Data.Entities
{
    public abstract class CategoryEntity : Entity
    {
        public string Name { get; set; }

        public string Description { get; set; }
    }
}