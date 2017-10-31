using ItForum.Data;
using ItForum.Data.Domains;

namespace ItForum.Services
{
    public class TagService : Service<Tag>
    {
        public TagService(NeptuneContext context) : base(context)
        {
        }
    }
}