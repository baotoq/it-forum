using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class PostDto : PostEntity
    {
        public UserDto CreatedBy { get; set; }

        public UserDto ApprovedBy { get; set; }

        public List<PostDto> Replies { get; set; }

        public List<VoteDto> Votes { get; set; }

        public class UserDto : UserEntity
        {
        }

        public class VoteDto
        {
            public int UserId { get; set; }
        }
    }

    public class PostMapperProfile : Profile
    {
        public PostMapperProfile()
        {
            CreateMap<Post, PostDto>();
            CreateMap<User, PostDto.UserDto>()
                .ForMember(d => d.Password, s => s.Ignore());
            CreateMap<Vote, PostDto.VoteDto>();
        }
    }
}