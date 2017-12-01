using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TopicDto : TopicEntity
    {
        public List<TopicDto> SubTopics { get; set; }

        public List<ThreadDto> Threads { get; set; }

        public int NumberOfThreads { get; set; }

        public class ThreadDto : ThreadEntity
        {
            public int NumberOfPosts { get; set; }

            public UserDto CreatedBy { get; set; }
        }

        public class UserDto : UserEntity
        {
        }
    }

    public class CategoryMapperProfile : Profile
    {
        public CategoryMapperProfile()
        {
            CreateMap<Topic, TopicDto>()
                .ForMember(d => d.NumberOfThreads, s => s.MapFrom(t => t.Threads.Count));
            CreateMap<Thread, TopicDto.ThreadDto>()
                .ForMember(d => d.NumberOfPosts, s => s.MapFrom(t => t.Posts.Count));
            CreateMap<User, TopicDto.UserDto>()
                .ForMember(d => d.Password, s => s.Ignore());
        }
    }
}