using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Udemy.Models
{
    public class UserLike
    {
        // this is the user that will click the like button
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }

        public AppUser LikedUser { get; set; }
        public int LikedUserId { get; set; }
    }
}
