namespace NutriMind.API.Models.DTOs;

// ==================== AUTH DTOs ====================

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FullName { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UserDto? User { get; set; }
}

// ==================== USER DTOs ====================

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Plan { get; set; } = "Free Plan";
    public DateTime CreatedAt { get; set; }
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Plan { get; set; }
}

// ==================== SETTINGS DTOs ====================

public class UserSettingsDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public bool PushNotifications { get; set; } = true;
    public bool EmailUpdates { get; set; } = true;
    public bool WorkoutReminders { get; set; } = true;
    public bool NutritionTips { get; set; } = false;
    public bool MarketingComm { get; set; } = false;
    public string DistanceUnit { get; set; } = "km";
    public string WeightUnit { get; set; } = "kg";
    public string HeightUnit { get; set; } = "cm";
    public string WaterUnit { get; set; } = "L";
    public string TemperatureUnit { get; set; } = "C";
    public string Theme { get; set; } = "dark";
    public bool ShareAnonymousData { get; set; } = true;
}

public class UpdateSettingsRequest
{
    public bool? PushNotifications { get; set; }
    public bool? EmailUpdates { get; set; }
    public bool? WorkoutReminders { get; set; }
    public bool? NutritionTips { get; set; }
    public bool? MarketingComm { get; set; }
    public string? DistanceUnit { get; set; }
    public string? WeightUnit { get; set; }
    public string? HeightUnit { get; set; }
    public string? WaterUnit { get; set; }
    public string? TemperatureUnit { get; set; }
    public string? Theme { get; set; }
    public bool? ShareAnonymousData { get; set; }
}

// ==================== PROFILE DTOs ====================

public class UserProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? Phone { get; set; }
    public DateTime? Dob { get; set; }
    public string? Gender { get; set; }
    public string? Height { get; set; }
    public string? Weight { get; set; }
    public string? ActivityLevel { get; set; }
}

public class UpdateProfileRequest
{
    public string? Phone { get; set; }
    public DateTime? Dob { get; set; }
    public string? Gender { get; set; }
    public string? Height { get; set; }
    public string? Weight { get; set; }
    public string? ActivityLevel { get; set; }
}

// ==================== WORKOUT DTOs ====================

public class WorkoutDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int Duration { get; set; }
    public int CaloriesBurned { get; set; }
    public string Difficulty { get; set; } = "Beginner";
    public DateTime CompletedAt { get; set; }
    public int ExercisesCompleted { get; set; }
}

public class CreateWorkoutRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int Duration { get; set; }
    public int CaloriesBurned { get; set; }
    public string Difficulty { get; set; } = "Beginner";
    public int ExercisesCompleted { get; set; }
}

// ==================== NUTRITION DTOs ====================

public class NutritionLogDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public string MealType { get; set; } = string.Empty;
    public string FoodName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Calories { get; set; }
    public double Protein { get; set; }
    public double Carbs { get; set; }
    public double Fats { get; set; }
    public double Fiber { get; set; }
    public double Sugar { get; set; }
    public double Sodium { get; set; }
    public string? Emoji { get; set; }
    public string Serving { get; set; } = "1 serving";
}

public class CreateNutritionLogRequest
{
    public DateTime? Date { get; set; }
    public string MealType { get; set; } = string.Empty;
    public string FoodName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Calories { get; set; }
    public double Protein { get; set; }
    public double Carbs { get; set; }
    public double Fats { get; set; }
    public double Fiber { get; set; }
    public double Sugar { get; set; }
    public double Sodium { get; set; }
    public string? Emoji { get; set; }
    public string? Serving { get; set; }
}

// ==================== SLEEP DTOs ====================

public class SleepRecordDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public string BedTime { get; set; } = string.Empty;
    public string WakeTime { get; set; } = string.Empty;
    public double HoursSlept { get; set; }
    public int SleepQuality { get; set; }
    public int DeepSleep { get; set; }
    public int LightSleep { get; set; }
    public int RemSleep { get; set; }
    public int TimesAwake { get; set; }
}

public class CreateSleepRecordRequest
{
    public DateTime? Date { get; set; }
    public string BedTime { get; set; } = string.Empty;
    public string WakeTime { get; set; } = string.Empty;
    public int SleepQuality { get; set; }
    public int DeepSleep { get; set; }
    public int LightSleep { get; set; }
    public int RemSleep { get; set; }
    public int TimesAwake { get; set; }
}

// ==================== HYDRATION DTOs ====================

public class HydrationLogDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public double Amount { get; set; }
    public string Unit { get; set; } = "L";
    public DateTime LoggedAt { get; set; }
}

public class CreateHydrationLogRequest
{
    public DateTime? Date { get; set; }
    public double Amount { get; set; }
    public string? Unit { get; set; }
}

// ==================== VITALS DTOs ====================

public class VitalRecordDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public int HeartRate { get; set; }
    public int? SystolicBP { get; set; }
    public int? DiastolicBP { get; set; }
    public double? Temperature { get; set; }
    public int? OxygenSaturation { get; set; }
    public double? Weight { get; set; }
    public string? Notes { get; set; }
}

public class CreateVitalRecordRequest
{
    public DateTime? Date { get; set; }
    public int HeartRate { get; set; }
    public int? SystolicBP { get; set; }
    public int? DiastolicBP { get; set; }
    public double? Temperature { get; set; }
    public int? OxygenSaturation { get; set; }
    public double? Weight { get; set; }
    public string? Notes { get; set; }
}

// ==================== GOALS DTOs ====================

public class GoalDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public double TargetValue { get; set; }
    public double CurrentValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGoalRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public double TargetValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
}

public class UpdateGoalRequest
{
    public double CurrentValue { get; set; }
    public bool? IsCompleted { get; set; }
}

// ==================== API RESPONSE ====================

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}

// ==================== LOGIN HISTORY DTOs ====================

public class LoginLogDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? IpAddress { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class LoginHistoryResponse
{
    public List<LoginLogDto> Logs { get; set; } = new List<LoginLogDto>();
    public int TotalCount { get; set; }
}
