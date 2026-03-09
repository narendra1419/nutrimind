using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriMind.API.Models.DTOs;
using NutriMind.API.Services;

namespace NutriMind.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var userId = GetUserId();
        var user = await _userService.GetUserAsync(userId);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        var userId = GetUserId();
        var user = await _userService.UpdateUserAsync(userId, request);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpGet("settings")]
    public async Task<ActionResult<UserSettingsDto>> GetSettings()
    {
        var userId = GetUserId();
        var settings = await _userService.GetSettingsAsync(userId);
        if (settings == null) return NotFound();
        return Ok(settings);
    }

    [HttpPut("settings")]
    public async Task<ActionResult<UserSettingsDto>> UpdateSettings([FromBody] UpdateSettingsRequest request)
    {
        var userId = GetUserId();
        var settings = await _userService.UpdateSettingsAsync(userId, request);
        if (settings == null) return NotFound();
        return Ok(settings);
    }

    [HttpGet("profile-data")]
    public async Task<ActionResult<UserProfileDto>> GetProfileData()
    {
        var userId = GetUserId();
        var profile = await _userService.GetProfileAsync(userId);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPut("profile-data")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfileData([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var profile = await _userService.UpdateProfileAsync(userId, request);
        if (profile == null) return NotFound();
        return Ok(profile);
    }
}

