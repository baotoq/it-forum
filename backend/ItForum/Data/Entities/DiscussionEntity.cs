using System;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class DiscussionEntity : IEntity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public int CreatedById { get; set; }

        public int TopicId { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}