using System;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ItForum.Common
{
    public static class Jwt
    {
        public static string Issuer { get; set; } = "http://localhost:5000";

        public static string Audience { get; set; } = "http://localhost:4200";

        public static string Secret { get; set; } = "Sagittarius@16090446";

        public static DateTime NotBefore => DateTime.Now;

        public static DateTime Expires => NotBefore.AddMinutes(30);

        public static SigningCredentials SigningCredentials { get; set; } =
            new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Secret)),
                SecurityAlgorithms.HmacSha256);
    }
}