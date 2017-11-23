using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data;
using ItForum.Data.Dtos;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;
using ItForum.Data.Seeds;
using System.Threading.Tasks;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SeedController : Controller
    {
        private readonly NeptuneContext context;

        public SeedController(NeptuneContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Init()
        {
            await DataSeeder.InitializeAsync(context);
            return Ok();
        }
    }
}