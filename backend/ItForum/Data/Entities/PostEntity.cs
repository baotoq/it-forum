using System;
using ItForum.Data.Domains;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class PostEntity : IEntity
    {
        public string Content { get; set; }

        public int? ThreadId { get; set; }

        public int? CreatedById { get; set; }

        public int? ApprovalStatusModifiedById { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}