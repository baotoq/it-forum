namespace ItForum.Data.Entities.Core
{
    public interface IEntity : ITimeStampEntity
    {
        int Id { get; set; }
    }
}