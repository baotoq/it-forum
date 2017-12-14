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

        [HttpGet("{numberOfTopics}")]
        public async Task<IActionResult> Seed(int numberOfTopics)
        {
            await _dataSeeder.InitializeAsync(numberOfTopics);
            return Ok("done");
        }
    }
}