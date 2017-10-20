using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TopicDto : TopicEntity
    {
        public List<DiscussionDto> Discussions { get; set; }

        public class DiscussionDto : DiscussionEntity
        {
        }
    }

    public class CategoryMapperProfile : Profile
    {
        public CategoryMapperProfile()
        {
            CreateMap<Topic, TopicDto>();
            CreateMap<Discussion, TopicDto.DiscussionDto>();
        }
    }
}