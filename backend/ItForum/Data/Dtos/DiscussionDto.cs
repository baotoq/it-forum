using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class DiscussionDto : DiscussionEntity
    {
        public List<ThreadDto> Threads { get; set; }

        public int NumberOfThreads { get; set; }

        public class ThreadDto : ThreadEntity
        {
            public UserDto User { get; set; }

            public int NumberOfPosts { get; set; }
        }

        public class UserDto : UserEntity
        {
        }
    }

    public class TopicMapperProfile : Profile
    {
        public TopicMapperProfile()
        {
            CreateMap<Discussion, DiscussionDto>()
                .ForMember(d => d.NumberOfThreads, s => s.MapFrom(x => x.Threads.Count));
            CreateMap<User, DiscussionDto.UserDto>();
            CreateMap<Thread, DiscussionDto.ThreadDto>()
                .ForMember(d => d.NumberOfPosts, s => s.MapFrom(x => x.Posts.Count));
        }
    }
}