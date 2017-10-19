using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class CategoryDto : CategoryEntity
    {
        public List<TopicDto> Topics { get; set; }

        public class TopicDto : TopicEntity
        {
        }
    }

    public class CategoryMapperProfile : Profile
    {
        public CategoryMapperProfile()
        {
            CreateMap<Category, CategoryDto>();
            CreateMap<Topic, CategoryDto.TopicDto>();
        }
    }
}