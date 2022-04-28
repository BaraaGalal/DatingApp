using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Udemy.Data;
using Udemy.DTO;
using Udemy.Helpers;
using Udemy.Interface;
using Udemy.Models;

namespace Udemy.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto register)
        {
            if (await UserExisit(register.Username)) return BadRequest("This Name Is Taken");

            var user = mapper.Map<AppUser>(register);

            user.UserName = register.Username.ToLower();

            var result = await userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roalResult = await userManager.AddToRoleAsync(user, "Member");

            if (!roalResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto login)
        {
            var user = await userManager.Users
                // I add this B/C error has happened on the video S11E12 
                // if I don't add the photo will not show
                .Include(p => p.photos) 
                .SingleOrDefaultAsync(ww => ww.UserName == login.Username.ToLower());

            if (user == null) return Unauthorized("Invalid Name");

            var result = await signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                PhotoUrl = user.photos.FirstOrDefault(ww => ww.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }


        private async Task<bool> UserExisit(string username)
        {
            return await userManager.Users.AnyAsync(ww => ww.UserName == username.ToLower());
        }
    }
}
