using System;

namespace ItForum.Data.Entities
{
    public abstract class TimeStampEntity
    {
        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public DateTime? DeletedDate { get; set; }
    }
}