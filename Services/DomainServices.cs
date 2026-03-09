
using Microsoft.EntityFrameworkCore;
using NutriMind.API.Data;
using NutriMind.API.Models;
using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

// ==================== WORKOUT SERVICE ====================

public class WorkoutService : IWorkoutService
{
    private readonly ApplicationDbContext _context;

    public WorkoutService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WorkoutDto>> GetWorkoutsAsync(Guid userId)
    {
        var workouts = await _context.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CompletedAt)
            .ToListAsync();

        return workouts.Select(MapToDto);
    }

    public async Task<WorkoutDto?> GetWorkoutAsync(Guid userId, Guid workoutId)
    {
        var workout = await _context.Workouts
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == workoutId);

        return workout == null ? null : MapToDto(workout);
    }

    public async Task<WorkoutDto> CreateWorkoutAsync(Guid userId, CreateWorkoutRequest request)
    {
        var workout = new Workout
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            Icon = request.Icon,
            Duration = request.Duration,
            CaloriesBurned = request.CaloriesBurned,
            Difficulty = request.Difficulty,
            ExercisesCompleted = request.ExercisesCompleted,
            CompletedAt = DateTime.UtcNow
        };

        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();

        return MapToDto(workout);
    }

    public async Task<bool> DeleteWorkoutAsync(Guid userId, Guid workoutId)
    {
        var workout = await _context.Workouts
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == workoutId);

        if (workout == null) return false;

        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        return true;
    }

    private static WorkoutDto MapToDto(Workout w) => new()
    {
        Id = w.Id,
        UserId = w.UserId,
        Title = w.Title,
        Description = w.Description,
        Icon = w.Icon,
        Duration = w.Duration,
        CaloriesBurned = w.CaloriesBurned,
        Difficulty = w.Difficulty,
        CompletedAt = w.CompletedAt,
        ExercisesCompleted = w.ExercisesCompleted
    };
}

// ==================== NUTRITION SERVICE ====================

public class NutritionService : INutritionService
{
    private readonly ApplicationDbContext _context;

    public NutritionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NutritionLogDto>> GetNutritionLogsAsync(Guid userId, DateTime? date = null)
    {
        var query = _context.NutritionLogs.Where(n => n.UserId == userId);
        
        if (date.HasValue)
        {
            var dateOnly = date.Value.Date;
            query = query.Where(n => n.Date.Date == dateOnly);
        }

        var logs = await query.OrderByDescending(n => n.Date).ToListAsync();
        return logs.Select(MapToDto);
    }

    public async Task<NutritionLogDto?> GetNutritionLogAsync(Guid userId, Guid logId)
    {
        var log = await _context.NutritionLogs
            .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == logId);

        return log == null ? null : MapToDto(log);
    }

    public async Task<NutritionLogDto> CreateNutritionLogAsync(Guid userId, CreateNutritionLogRequest request)
    {
        var log = new NutritionLog
        {
            UserId = userId,
            Date = request.Date ?? DateTime.UtcNow,
            MealType = request.MealType,
            FoodName = request.FoodName,
            Description = request.Description,
            Calories = request.Calories,
            Protein = request.Protein,
            Carbs = request.Carbs,
            Fats = request.Fats,
            Fiber = request.Fiber,
            Sugar = request.Sugar,
            Sodium = request.Sodium,
            Emoji = request.Emoji,
            Serving = request.Serving ?? "1 serving"
        };

        _context.NutritionLogs.Add(log);
        await _context.SaveChangesAsync();

        return MapToDto(log);
    }

    public async Task<bool> DeleteNutritionLogAsync(Guid userId, Guid logId)
    {
        var log = await _context.NutritionLogs
            .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == logId);

        if (log == null) return false;

        _context.NutritionLogs.Remove(log);
        await _context.SaveChangesAsync();
        return true;
    }

    private static NutritionLogDto MapToDto(NutritionLog n) => new()
    {
        Id = n.Id,
        UserId = n.UserId,
        Date = n.Date,
        MealType = n.MealType,
        FoodName = n.FoodName,
        Description = n.Description,
        Calories = n.Calories,
        Protein = n.Protein,
        Carbs = n.Carbs,
        Fats = n.Fats,
        Fiber = n.Fiber,
        Sugar = n.Sugar,
        Sodium = n.Sodium,
        Emoji = n.Emoji,
        Serving = n.Serving
    };
}

// ==================== SLEEP SERVICE ====================

public class SleepService : ISleepService
{
    private readonly ApplicationDbContext _context;

    public SleepService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SleepRecordDto>> GetSleepRecordsAsync(Guid userId, DateTime? date = null)
    {
        var query = _context.SleepRecords.Where(s => s.UserId == userId);
        
        if (date.HasValue)
        {
            var dateOnly = date.Value.Date;
            query = query.Where(s => s.Date.Date == dateOnly);
        }

        var records = await query.OrderByDescending(s => s.Date).ToListAsync();
        return records.Select(MapToDto);
    }

    public async Task<SleepRecordDto?> GetSleepRecordAsync(Guid userId, Guid recordId)
    {
        var record = await _context.SleepRecords
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Id == recordId);

        return record == null ? null : MapToDto(record);
    }

    public async Task<SleepRecordDto> CreateSleepRecordAsync(Guid userId, CreateSleepRecordRequest request)
    {
        // Parse times
        TimeSpan.TryParse(request.BedTime, out var bedTime);
        TimeSpan.TryParse(request.WakeTime, out var wakeTime);

        // Calculate hours slept
        var hoursSlept = (wakeTime - bedTime).TotalHours;
        if (hoursSlept < 0) hoursSlept += 24; // Handle overnight

        var record = new SleepRecord
        {
            UserId = userId,
            Date = request.Date ?? DateTime.UtcNow,
            BedTime = bedTime,
            WakeTime = wakeTime,
            HoursSlept = hoursSlept,
            SleepQuality = request.SleepQuality,
            DeepSleep = request.DeepSleep,
            LightSleep = request.LightSleep,
            RemSleep = request.RemSleep,
            TimesAwake = request.TimesAwake
        };

        _context.SleepRecords.Add(record);
        await _context.SaveChangesAsync();

        return MapToDto(record);
    }

    public async Task<bool> DeleteSleepRecordAsync(Guid userId, Guid recordId)
    {
        var record = await _context.SleepRecords
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Id == recordId);

        if (record == null) return false;

        _context.SleepRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    private static SleepRecordDto MapToDto(SleepRecord s) => new()
    {
        Id = s.Id,
        UserId = s.UserId,
        Date = s.Date,
        BedTime = s.BedTime.ToString(@"hh\:mm"),
        WakeTime = s.WakeTime.ToString(@"hh\:mm"),
        HoursSlept = s.HoursSlept,
        SleepQuality = s.SleepQuality,
        DeepSleep = s.DeepSleep,
        LightSleep = s.LightSleep,
        RemSleep = s.RemSleep,
        TimesAwake = s.TimesAwake
    };
}

// ==================== HYDRATION SERVICE ====================

public class HydrationService : IHydrationService
{
    private readonly ApplicationDbContext _context;

    public HydrationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HydrationLogDto>> GetHydrationLogsAsync(Guid userId, DateTime? date = null)
    {
        var query = _context.HydrationLogs.Where(h => h.UserId == userId);
        
        if (date.HasValue)
        {
            var dateOnly = date.Value.Date;
            query = query.Where(h => h.Date.Date == dateOnly);
        }

        var logs = await query.OrderByDescending(h => h.LoggedAt).ToListAsync();
        return logs.Select(MapToDto);
    }

    public async Task<HydrationLogDto?> GetHydrationLogAsync(Guid userId, Guid logId)
    {
        var log = await _context.HydrationLogs
            .FirstOrDefaultAsync(h => h.UserId == userId && h.Id == logId);

        return log == null ? null : MapToDto(log);
    }

    public async Task<HydrationLogDto> CreateHydrationLogAsync(Guid userId, CreateHydrationLogRequest request)
    {
        var log = new HydrationLog
        {
            UserId = userId,
            Date = request.Date ?? DateTime.UtcNow,
            Amount = request.Amount,
            Unit = request.Unit ?? "L",
            LoggedAt = DateTime.UtcNow
        };

        _context.HydrationLogs.Add(log);
        await _context.SaveChangesAsync();

        return MapToDto(log);
    }

    public async Task<bool> DeleteHydrationLogAsync(Guid userId, Guid logId)
    {
        var log = await _context.HydrationLogs
            .FirstOrDefaultAsync(h => h.UserId == userId && h.Id == logId);

        if (log == null) return false;

        _context.HydrationLogs.Remove(log);
        await _context.SaveChangesAsync();
        return true;
    }

    private static HydrationLogDto MapToDto(HydrationLog h) => new()
    {
        Id = h.Id,
        UserId = h.UserId,
        Date = h.Date,
        Amount = h.Amount,
        Unit = h.Unit,
        LoggedAt = h.LoggedAt
    };
}

// ==================== VITALS SERVICE ====================

public class VitalsService : IVitalsService
{
    private readonly ApplicationDbContext _context;

    public VitalsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VitalRecordDto>> GetVitalRecordsAsync(Guid userId, DateTime? date = null)
    {
        var query = _context.VitalRecords.Where(v => v.UserId == userId);
        
        if (date.HasValue)
        {
            var dateOnly = date.Value.Date;
            query = query.Where(v => v.Date.Date == dateOnly);
        }

        var records = await query.OrderByDescending(v => v.Date).ToListAsync();
        return records.Select(MapToDto);
    }

    public async Task<VitalRecordDto?> GetVitalRecordAsync(Guid userId, Guid recordId)
    {
        var record = await _context.VitalRecords
            .FirstOrDefaultAsync(v => v.UserId == userId && v.Id == recordId);

        return record == null ? null : MapToDto(record);
    }

    public async Task<VitalRecordDto> CreateVitalRecordAsync(Guid userId, CreateVitalRecordRequest request)
    {
        var record = new VitalRecord
        {
            UserId = userId,
            Date = request.Date ?? DateTime.UtcNow,
            HeartRate = request.HeartRate,
            SystolicBP = request.SystolicBP,
            DiastolicBP = request.DiastolicBP,
            Temperature = request.Temperature,
            OxygenSaturation = request.OxygenSaturation,
            Weight = request.Weight,
            Notes = request.Notes
        };

        _context.VitalRecords.Add(record);
        await _context.SaveChangesAsync();

        return MapToDto(record);
    }

    public async Task<bool> DeleteVitalRecordAsync(Guid userId, Guid recordId)
    {
        var record = await _context.VitalRecords
            .FirstOrDefaultAsync(v => v.UserId == userId && v.Id == recordId);

        if (record == null) return false;

        _context.VitalRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    private static VitalRecordDto MapToDto(VitalRecord v) => new()
    {
        Id = v.Id,
        UserId = v.UserId,
        Date = v.Date,
        HeartRate = v.HeartRate,
        SystolicBP = v.SystolicBP,
        DiastolicBP = v.DiastolicBP,
        Temperature = v.Temperature,
        OxygenSaturation = v.OxygenSaturation,
        Weight = v.Weight,
        Notes = v.Notes
    };
}

// ==================== GOALS SERVICE ====================

public class GoalsService : IGoalsService
{
    private readonly ApplicationDbContext _context;

    public GoalsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GoalDto>> GetGoalsAsync(Guid userId)
    {
        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        return goals.Select(MapToDto);
    }

    public async Task<GoalDto?> GetGoalAsync(Guid userId, Guid goalId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.UserId == userId && g.Id == goalId);

        return goal == null ? null : MapToDto(goal);
    }

    public async Task<GoalDto> CreateGoalAsync(Guid userId, CreateGoalRequest request)
    {
        var goal = new Goal
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            TargetType = request.TargetType,
            TargetValue = request.TargetValue,
            CurrentValue = 0,
            Unit = request.Unit,
            Deadline = request.Deadline,
            IsCompleted = false
        };

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return MapToDto(goal);
    }

    public async Task<GoalDto?> UpdateGoalAsync(Guid userId, Guid goalId, UpdateGoalRequest request)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.UserId == userId && g.Id == goalId);

        if (goal == null) return null;

        goal.CurrentValue = request.CurrentValue;
        
        if (request.IsCompleted.HasValue)
        {
            goal.IsCompleted = request.IsCompleted.Value;
        }

        goal.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(goal);
    }

    public async Task<bool> DeleteGoalAsync(Guid userId, Guid goalId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.UserId == userId && g.Id == goalId);

        if (goal == null) return false;

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();
        return true;
    }

    private static GoalDto MapToDto(Goal g) => new()
    {
        Id = g.Id,
        UserId = g.UserId,
        Title = g.Title,
        Description = g.Description,
        Category = g.Category,
        TargetType = g.TargetType,
        TargetValue = g.TargetValue,
        CurrentValue = g.CurrentValue,
        Unit = g.Unit,
        Deadline = g.Deadline,
        IsCompleted = g.IsCompleted,
        CreatedAt = g.CreatedAt
    };
}

