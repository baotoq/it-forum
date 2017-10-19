using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TopicDto : TopicEntity
    {
        public List<ThreadDto> Threads { get; set; }

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
            CreateMap<Topic, TopicDto>();
            CreateMap<User, TopicDto.UserDto>();
            CreateMap<Thread, TopicDto.ThreadDto>()
                .ForMember(d => d.NumberOfPosts, s => s.MapFrom(x => x.Posts.Count));
        }
    }
}