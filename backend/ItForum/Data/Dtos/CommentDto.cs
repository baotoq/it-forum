using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;
using ItForum.Services;

namespace ItForum.Data.Dtos
{
    public class CommentDto : CommentEntity
    {
        public int Point { get; set; }

        public int PostId { get; set; }

        public int UserId { get; set; }

        public UserDto User { get; set; }

        public List<VoteDto> CommentVotes { get; set; }

        public class UserDto : UserEntity
        {
        }

        public class VoteDto : VoteEntity
        {
            public int UserId { get; set; }
        }
    }

    public class CommentMapperProfile : Profile
    {
        public CommentMapperProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Point,
                    s => s.MapFrom(c => HelperService.CaculatePoint(new List<Vote>(c.CommentVotes))));

            CreateMap<User, CommentDto.UserDto>();
            CreateMap<Vote, CommentDto.VoteDto>();
        }
    }
}