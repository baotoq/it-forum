using System;

namespace ItForum.Data.Entities.Core
{
    public interface ITimeStampEntity
    {
        DateTime? DateCreated { get; set; }

        DateTime? DateDeleted { get; set; }
    }
}