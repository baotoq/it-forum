using System;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public class ThreadTagEntity : ITimeStampEntity
    {
        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}