using AutoMapper;
using ItForum.Data;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    public class TagController : Controller
    {
        private readonly IMapper _mapper;
        private readonly TagService _tagService;
        private readonly UnitOfWork _unitOfWork;

        public TagController(TagService tagService, UnitOfWork unitOfWork, IMapper mapper)
        {
            _tagService = tagService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var tags = _tagService.ToList();
            return Ok(tags);
        }
    }
}