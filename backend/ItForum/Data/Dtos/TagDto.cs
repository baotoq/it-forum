using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TagDto : TagEntity
    {
        public int Usage { get; set; }
    }

    public class TagMapperProfile : Profile
    {
        public TagMapperProfile()
        {
            CreateMap<Tag, TagDto>()
                .ForMember(d => d.Usage, s => s.MapFrom(x => x.ThreadTags.Count));
        }
    }
}