using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class TopicEntity : IEntity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public int NumberOfThreads { get; set; }

        public int? CreatedById { get; set; }

        public int? ParentId { get; set; }

        public int Level { get; set; }

        public int OrderIndex { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}