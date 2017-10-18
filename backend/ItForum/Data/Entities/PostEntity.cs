using System;

namespace ItForum.Data.Entities
{
    public abstract class PostEntity : Entity
    {
        public string Title { get; set; }

        public string Content { get; set; }

        public int Views { get; set; }

        public DateTime LastActivity { get; set; }
    }
}