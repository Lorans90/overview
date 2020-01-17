using Overview.Extensions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Overview.Controllers.Resources;
using Overview.Services;

namespace Overview.Controllers.Users
{
	[Route("api/v1/Template/[controller]")]
	[EnableCors("CorsPolicy")]
    [ApiController]
    public class PasswordController : ControllerBase
	{
		private readonly IUsersService _usersService;

		public PasswordController(IUsersService usersService)
		{
			_usersService = usersService;
			_usersService.CheckArgumentIsNull(nameof(usersService));
		}

		[HttpPost("[action]")]
		// [ValidateAntiForgeryToken]
		[Authorize]
		public async Task<IActionResult> ChangePassword(ChangePasswordResource model)
		{
			var user = await _usersService.GetCurrentUserAsync();
			if (user == null)
			{
				return BadRequest("NotFound");
			}

			var result = await _usersService.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
			if (result.Succeeded)
			{
				return Ok();
			}

			return BadRequest(result.Error);
		}


		[HttpPost("[action]")]
//		[ValidateAntiForgeryToken]
		[Authorize(Policy = CustomRoles.Admin)]
		public async Task<IActionResult> ResetPassword(ResetPasswordResource model)
		{
			var user = await _usersService.FindUserAsync(model.UserId);
			if (user == null)
			{
				return BadRequest("NotFound");
			}

			await _usersService.ResetPasswordAsync(user, model.NewPassword);
			return Ok();
		}

	}
}