using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class ThreadDto : ThreadEntity
    {
        public int Point { get; set; }

        public UserDto CreatedBy { get; set; }

        public List<PostDto> Posts { get; set; }

        public List<TagDto> Tags { get; set; }

        public class PostDto : PostEntity
        {
            public int Point { get; set; }

            public UserDto CreatedBy { get; set; }
        }

        public class UserDto : UserEntity
        {
        }

        public class TagDto : TagEntity
        {
        }
    }

    public class ThreadMapperProfile : Profile
    {
        public ThreadMapperProfile()
        {
            CreateMap<Thread, ThreadDto>()
                .ForMember(d => d.Tags, s => s.MapFrom(c => CreateTags(c.ThreadTags)));
            CreateMap<User, ThreadDto.UserDto>();
            CreateMap<Post, ThreadDto.PostDto>();
            CreateMap<Tag, ThreadDto.TagDto>();

            CreateMap<ThreadDto, Thread>();
            CreateMap<ThreadDto.UserDto, User>();
            CreateMap<ThreadDto.PostDto, Post>();
            CreateMap<ThreadDto.TagDto, Tag>();
        }

        private List<Tag> CreateTags(List<ThreadTag> threadTags)
        {
            var tags = new List<Tag>();
            threadTags.ForEach(x => tags.Add(x.Tag));
            return tags;
        }
    }
}