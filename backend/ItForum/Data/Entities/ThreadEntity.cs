using System;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class ThreadEntity : IEntity
    {
        public string Title { get; set; }

        public int Views { get; set; }

        public bool Pinned { get; set; }

        public DateTime LastActivity { get; set; }

        public int? CreatedById { get; set; }

        public int? DiscussionId { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}