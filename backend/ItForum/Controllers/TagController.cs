using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
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
            var tags = _tagService.FindAllNoTracking("ThreadTags");
            var dto = _mapper.Map<List<TagDto>>(tags.ToList());
            return Ok(dto);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Tag tag)
        {
            if (tag == null) return BadRequest();
            _tagService.Add(tag);
            await _unitOfWork.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created);
        }

        [Authorize(Roles = nameof(Role.Administrator))]
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] Tag tag)
        {
            var t = _tagService.FindById(tag.Id);
            if (t == null) return BadRequest();
           
            t.Name = tag.Name;
            _tagService.Update(t);

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
    }
}