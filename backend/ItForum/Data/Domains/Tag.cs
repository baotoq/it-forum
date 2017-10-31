using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Tag : TagEntity
    {
        public List<ThreadTag> ThreadTags { get; set; }
    }
}