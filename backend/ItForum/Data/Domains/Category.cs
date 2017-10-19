using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Category : CategoryEntity
    {
        public List<Topic> Topics { get; set; }
    }
}