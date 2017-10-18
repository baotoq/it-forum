using System;

namespace ItForum.Data.Entities
{
    public class Entity
    {
        public int Id { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}