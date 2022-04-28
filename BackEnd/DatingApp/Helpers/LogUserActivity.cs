using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.Extension;
using Microsoft.Extensions.DependencyInjection;
using Udemy.Interface;

namespace Udemy.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();

            var user = await unitOfWork.UserRepository.GetUserByIDAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();
        }
    }
}
