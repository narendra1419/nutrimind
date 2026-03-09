using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutDto>> GetWorkoutsAsync(Guid userId);
    Task<WorkoutDto?> GetWorkoutAsync(Guid userId, Guid workoutId);
    Task<WorkoutDto> CreateWorkoutAsync(Guid userId, CreateWorkoutRequest request);
    Task<bool> DeleteWorkoutAsync(Guid userId, Guid workoutId);
}

public interface INutritionService
{
    Task<IEnumerable<NutritionLogDto>> GetNutritionLogsAsync(Guid userId, DateTime? date = null);
    Task<NutritionLogDto?> GetNutritionLogAsync(Guid userId, Guid logId);
    Task<NutritionLogDto> CreateNutritionLogAsync(Guid userId, CreateNutritionLogRequest request);
    Task<bool> DeleteNutritionLogAsync(Guid userId, Guid logId);
}

public interface ISleepService
{
    Task<IEnumerable<SleepRecordDto>> GetSleepRecordsAsync(Guid userId, DateTime? date = null);
    Task<SleepRecordDto?> GetSleepRecordAsync(Guid userId, Guid recordId);
    Task<SleepRecordDto> CreateSleepRecordAsync(Guid userId, CreateSleepRecordRequest request);
    Task<bool> DeleteSleepRecordAsync(Guid userId, Guid recordId);
}

public interface IHydrationService
{
    Task<IEnumerable<HydrationLogDto>> GetHydrationLogsAsync(Guid userId, DateTime? date = null);
    Task<HydrationLogDto?> GetHydrationLogAsync(Guid userId, Guid logId);
    Task<HydrationLogDto> CreateHydrationLogAsync(Guid userId, CreateHydrationLogRequest request);
    Task<bool> DeleteHydrationLogAsync(Guid userId, Guid logId);
}

public interface IVitalsService
{
    Task<IEnumerable<VitalRecordDto>> GetVitalRecordsAsync(Guid userId, DateTime? date = null);
    Task<VitalRecordDto?> GetVitalRecordAsync(Guid userId, Guid recordId);
    Task<VitalRecordDto> CreateVitalRecordAsync(Guid userId, CreateVitalRecordRequest request);
    Task<bool> DeleteVitalRecordAsync(Guid userId, Guid recordId);
}

public interface IGoalsService
{
    Task<IEnumerable<GoalDto>> GetGoalsAsync(Guid userId);
    Task<GoalDto?> GetGoalAsync(Guid userId, Guid goalId);
    Task<GoalDto> CreateGoalAsync(Guid userId, CreateGoalRequest request);
    Task<GoalDto?> UpdateGoalAsync(Guid userId, Guid goalId, UpdateGoalRequest request);
    Task<bool> DeleteGoalAsync(Guid userId, Guid goalId);
}
