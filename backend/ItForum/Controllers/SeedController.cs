using System.Threading.Tasks;
using ItForum.Data.Seeds;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SeedController : Controller
    {
        private readonly DataSeeder _dataSeeder;

        public SeedController(DataSeeder dataSeeder)
        {
            _dataSeeder = dataSeeder;
        }

        [HttpGet]
        public async Task<IActionResult> Init()
        {
            await _dataSeeder.InitializeAsync();
            return Ok();
        }
    }
}