using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TopicDto : TopicEntity
    {
        public List<PostDto> Posts { get; set; }

        public class PostDto : PostEntity
        {
            public int UserId { get; set; }

            public UserDto User { get; set; }

            public int NumberOfComments { get; set; }
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
            CreateMap<Post, TopicDto.PostDto>()
                .ForMember(d => d.NumberOfComments, s => s.MapFrom(x => x.Comments.Count));
        }
    }
}