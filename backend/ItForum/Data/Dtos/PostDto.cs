using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;
using ItForum.Services;

namespace ItForum.Data.Dtos
{
    public class PostDto : PostEntity
    {
        public int Point { get; set; }

        public int UserId { get; set; }

        public UserDto User { get; set; }

        public List<VoteDto> PostVotes { get; set; }

        public List<CommentDto> Comments { get; set; }

        public class VoteDto : VoteEntity
        {
            public int UserId { get; set; }
        }

        public class CommentDto : CommentEntity
        {
            public int Point { get; set; }

            public int PostId { get; set; }

            public int UserId { get; set; }

            public UserDto User { get; set; }

            public List<VoteDto> CommentVotes { get; set; }
        }

        public class UserDto : UserEntity
        {
        }
    }

    public class PostMapperProfile : Profile
    {
        public PostMapperProfile()
        {
            CreateMap<Post, PostDto>()
                .ForMember(d => d.Point, s => s.MapFrom(c => HelperService.CaculatePoint(new List<Vote>(c.PostVotes))));
            ;
            CreateMap<User, PostDto.UserDto>();
            CreateMap<Comment, PostDto.CommentDto>()
                .ForMember(d => d.Point,
                    s => s.MapFrom(c => HelperService.CaculatePoint(new List<Vote>(c.CommentVotes))));
            CreateMap<Vote, PostDto.VoteDto>();
        }
    }
}