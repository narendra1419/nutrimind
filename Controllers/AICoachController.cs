
using Microsoft.AspNetCore.Mvc;
using NutriMind.API.Services;

namespace NutriMind.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AICoachController : ControllerBase
{
    private readonly IAICoachService _aiCoachService;

    public AICoachController(IAICoachService aiCoachService)
    {
        _aiCoachService = aiCoachService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AICoachRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { success = false, message = "Message cannot be empty" });
        }

        try
        {
            var response = await _aiCoachService.GetAIResponseAsync(request.Message, request.UserContext);
            return Ok(new { success = true, response });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}

public class AICoachRequest
{
    public string Message { get; set; } = string.Empty;
    public object? UserContext { get; set; }
}


