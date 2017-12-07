using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class PostDto : PostEntity
    {
        public int Point { get; set; }

        public UserDto CreatedBy { get; set; }

        public UserDto ApprovedBy { get; set; }

        public List<PostDto> Replies { get; set; }

        public class UserDto : UserEntity
        {
        }
    }

    public class CommentMapperProfile : Profile
    {
        public CommentMapperProfile()
        {
            CreateMap<Post, PostDto>();

            CreateMap<User, PostDto.UserDto>()
                .ForMember(d => d.Password, s => s.Ignore());
        }
    }
}