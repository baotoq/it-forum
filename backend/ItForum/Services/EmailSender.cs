using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ItForum.Services
{
    public class EmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string body)
        {
            var fromAddress = new MailAddress("bao16090446@gmail.com");
            const string fromPassword = "";

            var mailMessage = new MailMessage
            {
                From = fromAddress,
                To = {email},
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Timeout = 10000,
                EnableSsl = true,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            await smtp.SendMailAsync(mailMessage);
        }
    }
}