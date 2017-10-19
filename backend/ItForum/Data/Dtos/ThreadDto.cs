using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class ThreadDto : ThreadEntity
    {
        public int Point { get; set; }

        public UserDto User { get; set; }

        public List<PostDto> Posts { get; set; }

        public class PostDto : PostEntity
        {
            public int Point { get; set; }

            public UserDto User { get; set; }
        }

        public class UserDto : UserEntity
        {
        }
    }

    public class ThreadMapperProfile : Profile
    {
        public ThreadMapperProfile()
        {
            CreateMap<Thread, ThreadDto>();
            CreateMap<User, ThreadDto.UserDto>();
            CreateMap<Post, ThreadDto.PostDto>();
        }
    }
}