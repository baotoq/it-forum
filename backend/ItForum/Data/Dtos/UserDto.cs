using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class UserDto : UserEntity
    {
        public List<Management> Managements { get; set; }

        public int NumberOfPosts { get; set; }

        public int NumberOfThreads { get; set; }

        public int Reputations { get; set; }

        public class ManagementDto
        {
            public int TopicId { get; set; }

            public Topic Topic { get; set; }
        }
    }

    public class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(d => d.Password, s => s.Ignore());
            CreateMap<Management, UserDto.ManagementDto>();
        }
    }
}