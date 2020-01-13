using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Template.Controllers
{
    public class BaseController : Controller
    {
        public BaseController()
        {
        }

        protected string GetWebRootPath()
        {
            var hostingEnvironment = HttpContext.RequestServices.GetService(typeof(IHostingEnvironment)) as IHostingEnvironment;
            return hostingEnvironment.WebRootPath;
        }

        protected string GetReportBasePath()
        {
            var hostingEnvironment = HttpContext.RequestServices.GetService( typeof(IHostingEnvironment)) as IHostingEnvironment;
            return Path.Combine(GetWebRootPath(), "Reports");
        }

       
        protected int GetUserId()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userIdValue = claimsIdentity.FindFirst(ClaimTypes.UserData)?.Value;
            if (!string.IsNullOrWhiteSpace(userIdValue) && int.TryParse(userIdValue, out int userId))
            {
                return userId;
            }

            return 0;
        }


    }
}