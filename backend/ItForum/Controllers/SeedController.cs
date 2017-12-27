using System.Threading.Tasks;
using ItForum.Data.Seeds;
using ItForum.Services;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SeedController : Controller
    {
        private readonly DataSeeder _dataSeeder;
        private readonly EmailSender _emailSender;

        public SeedController(DataSeeder dataSeeder, EmailSender emailSender)
        {
            _dataSeeder = dataSeeder;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<IActionResult> Seed()
        {
            await _dataSeeder.InitializeAsync();
            return Ok("done");
        }
    }
}