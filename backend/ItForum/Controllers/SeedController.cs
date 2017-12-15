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

        [HttpGet("{numberOfTopics}")]
        public async Task<IActionResult> Seed(int numberOfTopics)
        {
            await _dataSeeder.InitializeAsync(numberOfTopics);
            return Ok("done");
        }

        [HttpGet("mail")]
        public async Task<IActionResult> Mail()
        {
            await _emailSender.SendEmailAsync("bao2703@gmail.com", "Subject", "Message");
            return Ok("done");
        }
    }
}