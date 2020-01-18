using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Overview.Controllers.Resources;
using Overview.Extensions;
using Overview.Services;
using Overview.Models;

namespace Overview.Controllers.Users
 {
	[Route("api/v1/Template/[controller]")]
	[EnableCors("CorsPolicy")]
	[ApiController]
    public class ReceivesController : ControllerBase
	{
		private readonly IRecievesService _receivesService;
		private readonly IMapper mapper;

		public ReceivesController(IMapper mapper, IRecievesService receivesService, IRolesService rolesService)
		{
			this.mapper = mapper;
			_receivesService = receivesService;
		}

		[AllowAnonymous]
		[HttpGet("[action]")]
		public async Task<List<Receive>> GetReceives()
		{
			return await _receivesService.GetAllReceives();
		}
		
		[AllowAnonymous]
		[HttpPost]
		public async Task<IActionResult> CreateReceive(ReceiveResource receiveResource)
		{
			Receive receive = await _receivesService.CreateReceiveAsync(receiveResource);
			return Ok(receive);
		}
	}
}
