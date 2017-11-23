using System.Threading.Tasks;
using ItForum.Data;
using ItForum.Data.Seeds;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SeedController : Controller
    {
        private readonly NeptuneContext _context;

        public SeedController(NeptuneContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Init()
        {
            await DataSeeder.InitializeAsync(_context);
            return Ok();
        }
    }
}