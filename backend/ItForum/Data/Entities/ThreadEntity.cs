using System;
using ItForum.Data.Domains;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class ThreadEntity : IEntity
    {
        public string Title { get; set; }

        public int Views { get; set; }

        public bool Pin { get; set; }

        public int NumberOfPosts { get; set; }

        public DateTime LastActivity { get; set; }

        public int? CreatedById { get; set; }

        public int? TopicId { get; set; }

        public int? ApprovalStatusModifiedById { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}