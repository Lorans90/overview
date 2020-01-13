using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Controllers.Resources;
using Template.Extensions;
using Template.Models;
using Template.Services;

namespace Template.Controllers.Template
 {
	[Route("api/v1/Template/[controller]")]
	[Authorize(Policy = CustomRoles.Admin)]
    [ApiController]
    public class UsersController : BaseController
	{
		private readonly IUsersService usersService;
		private readonly IRolesService rolesService;
		private readonly IMapper mapper;

		public UsersController(IMapper mapper, IUsersService usersService, IRolesService rolesService)
		{
			this.mapper = mapper;
			this.usersService = usersService;
			usersService.CheckArgumentIsNull(nameof(usersService));
			
			this.rolesService = rolesService;
			usersService.CheckArgumentIsNull(nameof(rolesService));
		}

		[HttpPost("[action]")]
		public async Task<QueryResultResource<UserResource>> GetUsers(QueryObject queryObject)
		{
			return await usersService.GetAllUsersAsync(queryObject);
		}
		
		[HttpPost]
		public async Task<IActionResult> CreateUser(SaveUserResource saveUserResource)
		{
			UserResource userResource = await usersService.CreateUserAsync(saveUserResource);
			return Ok(userResource);

		}
		
		[HttpPut("{userId}")]
		public async Task<IActionResult> UpdateUser(int userId, SaveUserResource saveUserResource)
		{
			var user = await usersService.FindUserAsync(userId);
			if (user == null)
				return NotFound();

			var userResource = await usersService.UpdateUserAsync(userId, saveUserResource);
			return Ok(userResource);

		}

		[HttpGet("[action]")]
		public async Task<IActionResult> GetRoles()
		{
			var roles = await rolesService.GetAllRoles();
			return Ok(roles);
		}
	}
}
