using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using ItForum.Data.Domains;
using MoreLinq;

namespace ItForum.Services
{
    public class HelperService
    {
        public int CaculatePoint(IEnumerable<Vote> votes)
        {
            var point = 0;
            votes.ForEach(x =>
            {
                if (x.Like) point++;
                else point--;
            });
            return point;
        }

        public string CreateSalt()
        {
            var bytes = new byte[128 / 8];
            using (var keyGenerator = RandomNumberGenerator.Create())
            {
                keyGenerator.GetBytes(bytes);
                return BitConverter.ToString(bytes).Replace("-", "").ToLower();
            }
        }

        public string Hash(string value)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(value));
                var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                return hash;
            }
        }

        public string Hash(string value, string salt)
        {
            return Hash($"{value}{salt}");
        }
    }
}