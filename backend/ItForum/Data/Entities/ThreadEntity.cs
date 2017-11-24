using System;

namespace ItForum.Data.Entities
{
    public abstract class ThreadEntity : Entity
    {
        public string Title { get; set; }

        public int Views { get; set; }

        public bool Pinned { get; set; }

        public DateTime LastActivity { get; set; }

        public int UserId { get; set; }

        public int DiscussionId { get; set; }
    }
}