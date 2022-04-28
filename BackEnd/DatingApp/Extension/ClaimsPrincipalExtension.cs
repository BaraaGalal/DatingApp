using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Udemy.Extension
{
    public static class ClaimsPrincipalExtension
    {
        /// this function will return the userName 
        /// but we need to be sure this is the same user not another one
        /// so we need to find the claim that match the name identifire
        /// so we return the user userName from the token that the API use to authenticate
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}
