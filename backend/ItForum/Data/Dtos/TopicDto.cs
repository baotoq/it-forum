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
            public List<ThreadDto> Threads { get; set; }

            public int NumberOfThreads { get; set; }
        }

        public class ThreadDto : ThreadEntity
        {
        }
    }

    public class CategoryMapperProfile : Profile
    {
        public CategoryMapperProfile()
        {
            CreateMap<Topic, TopicDto>();
            CreateMap<Discussion, TopicDto.DiscussionDto>()
                .ForMember(d => d.NumberOfThreads, s => s.MapFrom(x => x.Threads.Count));
            CreateMap<Thread, TopicDto.ThreadDto>();
        }
    }
}