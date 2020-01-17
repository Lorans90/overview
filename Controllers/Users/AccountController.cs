using Overview.Extensions;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Overview.Data;
using Overview.Models;
using Overview.Services;

namespace Overview.Controllers.Users
{
    [Route("api/v1/Template/[controller]")]
    [EnableCors("CorsPolicy")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly ITokenStoreService _tokenStoreService;
        private readonly IUnitOfWork _uow;

        public AccountController(
            IUsersService usersService,
            ITokenStoreService tokenStoreService,
            IUnitOfWork uow)
        {
            _usersService = usersService;
            _usersService.CheckArgumentIsNull(nameof(usersService));

            _tokenStoreService = tokenStoreService;
            _tokenStoreService.CheckArgumentIsNull(nameof(_tokenStoreService));

            _uow = uow;
            _uow.CheckArgumentIsNull(nameof(_uow));
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login(User loginUser)
        {
            if (loginUser == null)
            {
                return BadRequest("user is not set.");
            }

            var user = await _usersService.FindUserAsync(loginUser.Username, loginUser.Password);
            if (user == null || !user.IsActive)
            {
                return Unauthorized();
            }

            var tokenResource = await _tokenStoreService.CreateJwtTokens(user, refreshTokenSource: null);
            return Ok(tokenResource);
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> RefreshToken(JToken jsonBody)
        {
            var refreshToken = jsonBody.Value<string>("refreshToken");
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest("refreshToken is not set.");
            }

            var token = await _tokenStoreService.FindTokenAsync(refreshToken);
            if (token == null)
            {
                return Unauthorized();
            }

            var tokenResource = await _tokenStoreService.CreateJwtTokens(token.User, refreshToken);
            return Ok(tokenResource);
        }

        [AllowAnonymous]
        [HttpGet("[action]"), HttpPost("[action]")]
        public async Task<bool> Logout(JToken jsonBody)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userIdValue = claimsIdentity.FindFirst(ClaimTypes.UserData)?.Value;
            var refreshToken = jsonBody.Value<string>("refreshToken");

            // The Jwt implementation does not support "revoke OAuth token" (logout) by design.
            // Delete the user's tokens from the database (revoke its bearer token)
            await _tokenStoreService.RevokeUserBearerTokensAsync(userIdValue, refreshToken);
            await _uow.SaveChangesAsync();

            return true;
        }

        [HttpGet("[action]"), HttpPost("[action]")]
        public bool IsAuthenticated()
        {
            return User.Identity.IsAuthenticated;
        }

        [HttpGet("[action]"), HttpPost("[action]")]
        public IActionResult GetUserInfo()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return Ok(new { Username = claimsIdentity.Name });
        }
    }
}