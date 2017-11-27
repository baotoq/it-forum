﻿using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class DiscussionDto : DiscussionEntity
    {
        public List<ThreadDto> Threads { get; set; }

        public class ThreadDto : ThreadEntity
        {
            public UserDto CreatedBy { get; set; }

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
            CreateMap<Discussion, DiscussionDto>();
            CreateMap<User, DiscussionDto.UserDto>();
            CreateMap<Thread, DiscussionDto.ThreadDto>()
                .ForMember(d => d.NumberOfPosts, s => s.MapFrom(x => x.Posts.Count));
        }
    }
}