using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    public class CategoryController : Controller
    {
        private readonly CategoryService _categoryService;
        private readonly IMapper _mapper;
        private readonly UnitOfWork _unitOfWork;

        public CategoryController(CategoryService categoryService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _categoryService = categoryService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _categoryService.GetAll().ToList();
            var dto = _mapper.Map<List<CategoryDto>>(categories);
            return Ok(dto);
        }
    }
}