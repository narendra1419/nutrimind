using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NutriMind.API.Models;

// User entity - extends authentication
public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? FullName { get; set; }

    public string Plan { get; set; } = "Free Plan";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public UserProfile? Profile { get; set; }
    public UserSettings? Settings { get; set; }
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<NutritionLog> NutritionLogs { get; set; } = new List<NutritionLog>();
    public ICollection<SleepRecord> SleepRecords { get; set; } = new List<SleepRecord>();
    public ICollection<HydrationLog> HydrationLogs { get; set; } = new List<HydrationLog>();
    public ICollection<VitalRecord> VitalRecords { get; set; } = new List<VitalRecord>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
}

// User Settings entity
public class UserSettings
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// User Profile entity
public class UserProfile
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public string? Phone { get; set; }
    public DateTime? Dob { get; set; }
    public string? Gender { get; set; }
    public string? Height { get; set; }
    public string? Weight { get; set; }
    public string? ActivityLevel { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Workout entity
public class Workout
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int Duration { get; set; } // in minutes
    public int CaloriesBurned { get; set; }
    public string Difficulty { get; set; } = "Beginner";
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public int ExercisesCompleted { get; set; }
}

// Nutrition Log entity
public class NutritionLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string MealType { get; set; } = string.Empty; // breakfast, lunch, dinner, snack
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

// Sleep Record entity
public class SleepRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public TimeSpan BedTime { get; set; }
    public TimeSpan WakeTime { get; set; }
    public double HoursSlept { get; set; }
    public int SleepQuality { get; set; } // 1-10
    public int DeepSleep { get; set; } // minutes
    public int LightSleep { get; set; } // minutes
    public int RemSleep { get; set; } // minutes
    public int TimesAwake { get; set; }
}

// Hydration Log entity
public class HydrationLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public double Amount { get; set; } // in liters or ml
    public string Unit { get; set; } = "L";
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}

// Vital Record entity
public class VitalRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int HeartRate { get; set; }
    public int? SystolicBP { get; set; } // mmHg
    public int? DiastolicBP { get; set; } // mmHg
    public double? Temperature { get; set; } // Celsius
    public int? OxygenSaturation { get; set; } // SpO2 %
    public double? Weight { get; set; }
    public string? Notes { get; set; }
}

// Goal entity
public class Goal
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // fitness, nutrition, sleep, hydration
    public string TargetType { get; set; } = string.Empty; // numeric, boolean, duration
    public double TargetValue { get; set; }
    public double CurrentValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Login Log entity
public class LoginLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }

    [Required]
    public string Email { get; set; } = string.Empty;

    public bool Success { get; set; } = false;

    public string? IpAddress { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

