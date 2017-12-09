using System.Collections.Generic;
using ItForum.Data.Domains;

namespace ItForum.Services
{
    public class HelperService
    {
        public int CaculatePoint(List<Vote> votes)
        {
            var point = 0;
            votes.ForEach(x =>
            {
                if (x.Like) point++;
                else point--;
            });
            return point;
        }
    }
}