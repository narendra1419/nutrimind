using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NutriMind.API.Models.DTOs;
using NutriMind.API.Services;

namespace NutriMind.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutsController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkoutDto>>> GetWorkouts()
    {
        var userId = GetUserId();
        var workouts = await _workoutService.GetWorkoutsAsync(userId);
        return Ok(workouts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutDto>> GetWorkout(Guid id)
    {
        var userId = GetUserId();
        var workout = await _workoutService.GetWorkoutAsync(userId, id);
        if (workout == null) return NotFound();
        return Ok(workout);
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutDto>> CreateWorkout([FromBody] CreateWorkoutRequest request)
    {
        var userId = GetUserId();
        var workout = await _workoutService.CreateWorkoutAsync(userId, request);
        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(Guid id)
    {
        var userId = GetUserId();
        var result = await _workoutService.DeleteWorkoutAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NutritionController : ControllerBase
{
    private readonly INutritionService _nutritionService;

    public NutritionController(INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NutritionLogDto>>> GetNutritionLogs([FromQuery] DateTime? date = null)
    {
        var userId = GetUserId();
        var logs = await _nutritionService.GetNutritionLogsAsync(userId, date);
        return Ok(logs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NutritionLogDto>> GetNutritionLog(Guid id)
    {
        var userId = GetUserId();
        var log = await _nutritionService.GetNutritionLogAsync(userId, id);
        if (log == null) return NotFound();
        return Ok(log);
    }

    [HttpPost]
    public async Task<ActionResult<NutritionLogDto>> CreateNutritionLog([FromBody] CreateNutritionLogRequest request)
    {
        var userId = GetUserId();
        var log = await _nutritionService.CreateNutritionLogAsync(userId, request);
        return CreatedAtAction(nameof(GetNutritionLog), new { id = log.Id }, log);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNutritionLog(Guid id)
    {
        var userId = GetUserId();
        var result = await _nutritionService.DeleteNutritionLogAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SleepController : ControllerBase
{
    private readonly ISleepService _sleepService;

    public SleepController(ISleepService sleepService)
    {
        _sleepService = sleepService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SleepRecordDto>>> GetSleepRecords([FromQuery] DateTime? date = null)
    {
        var userId = GetUserId();
        var records = await _sleepService.GetSleepRecordsAsync(userId, date);
        return Ok(records);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SleepRecordDto>> GetSleepRecord(Guid id)
    {
        var userId = GetUserId();
        var record = await _sleepService.GetSleepRecordAsync(userId, id);
        if (record == null) return NotFound();
        return Ok(record);
    }

    [HttpPost]
    public async Task<ActionResult<SleepRecordDto>> CreateSleepRecord([FromBody] CreateSleepRecordRequest request)
    {
        var userId = GetUserId();
        var record = await _sleepService.CreateSleepRecordAsync(userId, request);
        return CreatedAtAction(nameof(GetSleepRecord), new { id = record.Id }, record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSleepRecord(Guid id)
    {
        var userId = GetUserId();
        var result = await _sleepService.DeleteSleepRecordAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HydrationController : ControllerBase
{
    private readonly IHydrationService _hydrationService;

    public HydrationController(IHydrationService hydrationService)
    {
        _hydrationService = hydrationService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HydrationLogDto>>> GetHydrationLogs([FromQuery] DateTime? date = null)
    {
        var userId = GetUserId();
        var logs = await _hydrationService.GetHydrationLogsAsync(userId, date);
        return Ok(logs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HydrationLogDto>> GetHydrationLog(Guid id)
    {
        var userId = GetUserId();
        var log = await _hydrationService.GetHydrationLogAsync(userId, id);
        if (log == null) return NotFound();
        return Ok(log);
    }

    [HttpPost]
    public async Task<ActionResult<HydrationLogDto>> CreateHydrationLog([FromBody] CreateHydrationLogRequest request)
    {
        var userId = GetUserId();
        var log = await _hydrationService.CreateHydrationLogAsync(userId, request);
        return CreatedAtAction(nameof(GetHydrationLog), new { id = log.Id }, log);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHydrationLog(Guid id)
    {
        var userId = GetUserId();
        var result = await _hydrationService.DeleteHydrationLogAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VitalsController : ControllerBase
{
    private readonly IVitalsService _vitalsService;

    public VitalsController(IVitalsService vitalsService)
    {
        _vitalsService = vitalsService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VitalRecordDto>>> GetVitalRecords([FromQuery] DateTime? date = null)
    {
        var userId = GetUserId();
        var records = await _vitalsService.GetVitalRecordsAsync(userId, date);
        return Ok(records);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VitalRecordDto>> GetVitalRecord(Guid id)
    {
        var userId = GetUserId();
        var record = await _vitalsService.GetVitalRecordAsync(userId, id);
        if (record == null) return NotFound();
        return Ok(record);
    }

    [HttpPost]
    public async Task<ActionResult<VitalRecordDto>> CreateVitalRecord([FromBody] CreateVitalRecordRequest request)
    {
        var userId = GetUserId();
        var record = await _vitalsService.CreateVitalRecordAsync(userId, request);
        return CreatedAtAction(nameof(GetVitalRecord), new { id = record.Id }, record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVitalRecord(Guid id)
    {
        var userId = GetUserId();
        var result = await _vitalsService.DeleteVitalRecordAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalsController : ControllerBase
{
    private readonly IGoalsService _goalsService;

    public GoalsController(IGoalsService goalsService)
    {
        _goalsService = goalsService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
    {
        var userId = GetUserId();
        var goals = await _goalsService.GetGoalsAsync(userId);
        return Ok(goals);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GoalDto>> GetGoal(Guid id)
    {
        var userId = GetUserId();
        var goal = await _goalsService.GetGoalAsync(userId, id);
        if (goal == null) return NotFound();
        return Ok(goal);
    }

    [HttpPost]
    public async Task<ActionResult<GoalDto>> CreateGoal([FromBody] CreateGoalRequest request)
    {
        var userId = GetUserId();
        var goal = await _goalsService.CreateGoalAsync(userId, request);
        return CreatedAtAction(nameof(GetGoal), new { id = goal.Id }, goal);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GoalDto>> UpdateGoal(Guid id, [FromBody] UpdateGoalRequest request)
    {
        var userId = GetUserId();
        var goal = await _goalsService.UpdateGoalAsync(userId, id, request);
        if (goal == null) return NotFound();
        return Ok(goal);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(Guid id)
    {
        var userId = GetUserId();
        var result = await _goalsService.DeleteGoalAsync(userId, id);
        if (!result) return NotFound();
        return NoContent();
    }
}

