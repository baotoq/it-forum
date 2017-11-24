using System;

namespace ItForum.Data.Entities
{
    public abstract class TimeStampEntity
    {
        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}