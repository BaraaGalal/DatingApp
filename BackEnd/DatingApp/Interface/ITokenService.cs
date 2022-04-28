using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.Models;

namespace Udemy.Interface
{
    public interface ITokenService 
    {
        Task<string> CreateToken(AppUser user);
    }
}
