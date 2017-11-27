using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class ThreadTag : ThreadTagEntity
    {
        public int ThreadId { get; set; }

        public Thread Thread { get; set; }

        public int TagId { get; set; }

        public Tag Tag { get; set; }
    }
}