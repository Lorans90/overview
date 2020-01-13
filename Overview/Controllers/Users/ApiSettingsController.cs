using Template.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Template.Controllers.Resources;
using Template.Extensions;

namespace Template.Controllers.Template
{
	[Route("api/v1/Template/[controller]")]
	public class ApiSettingsController : BaseController
	{
		private readonly IOptionsSnapshot<ApiSettings> _apiSettingsConfig;

		public ApiSettingsController(IOptionsSnapshot<ApiSettings> apiSettingsConfig)
		{
			_apiSettingsConfig = apiSettingsConfig;
			_apiSettingsConfig.CheckArgumentIsNull(nameof(apiSettingsConfig));
		}

		[AllowAnonymous]
		[HttpGet]
		public IActionResult Get()
		{
			// TODO: read config from AppSettings.json
			return Ok(new
			          {
				          LoginPath = "account/login",
				          LogoutPath = "account/logout",
				          RefreshTokenPath = "account/RefreshToken",
				          AccessTokenObjectKey = "accessToken",
				          RefreshTokenObjectKey = "refreshToken",
				          AdminRoleName = "Admin"
			          });
		}
	}
}