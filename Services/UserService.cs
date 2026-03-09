using Microsoft.EntityFrameworkCore;
using NutriMind.API.Data;
using NutriMind.API.Models;
using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> GetUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Plan = user.Plan,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserDto?> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        if (!string.IsNullOrEmpty(request.FullName))
            user.FullName = request.FullName;
        
        if (!string.IsNullOrEmpty(request.Plan))
            user.Plan = request.Plan;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Plan = user.Plan,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserSettingsDto?> GetSettingsAsync(Guid userId)
    {
        var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings == null) return null;

        return new UserSettingsDto
        {
            Id = settings.Id,
            UserId = settings.UserId,
            PushNotifications = settings.PushNotifications,
            EmailUpdates = settings.EmailUpdates,
            WorkoutReminders = settings.WorkoutReminders,
            NutritionTips = settings.NutritionTips,
            MarketingComm = settings.MarketingComm,
            DistanceUnit = settings.DistanceUnit,
            WeightUnit = settings.WeightUnit,
            HeightUnit = settings.HeightUnit,
            WaterUnit = settings.WaterUnit,
            TemperatureUnit = settings.TemperatureUnit,
            Theme = settings.Theme,
            ShareAnonymousData = settings.ShareAnonymousData
        };
    }

    public async Task<UserSettingsDto?> UpdateSettingsAsync(Guid userId, UpdateSettingsRequest request)
    {
        var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings == null) return null;

        if (request.PushNotifications.HasValue)
            settings.PushNotifications = request.PushNotifications.Value;
        if (request.EmailUpdates.HasValue)
            settings.EmailUpdates = request.EmailUpdates.Value;
        if (request.WorkoutReminders.HasValue)
            settings.WorkoutReminders = request.WorkoutReminders.Value;
        if (request.NutritionTips.HasValue)
            settings.NutritionTips = request.NutritionTips.Value;
        if (request.MarketingComm.HasValue)
            settings.MarketingComm = request.MarketingComm.Value;
        
        if (!string.IsNullOrEmpty(request.DistanceUnit))
            settings.DistanceUnit = request.DistanceUnit;
        if (!string.IsNullOrEmpty(request.WeightUnit))
            settings.WeightUnit = request.WeightUnit;
        if (!string.IsNullOrEmpty(request.HeightUnit))
            settings.HeightUnit = request.HeightUnit;
        if (!string.IsNullOrEmpty(request.WaterUnit))
            settings.WaterUnit = request.WaterUnit;
        if (!string.IsNullOrEmpty(request.TemperatureUnit))
            settings.TemperatureUnit = request.TemperatureUnit;
        if (!string.IsNullOrEmpty(request.Theme))
            settings.Theme = request.Theme;
        if (request.ShareAnonymousData.HasValue)
            settings.ShareAnonymousData = request.ShareAnonymousData.Value;

        settings.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return new UserSettingsDto
        {
            Id = settings.Id,
            UserId = settings.UserId,
            PushNotifications = settings.PushNotifications,
            EmailUpdates = settings.EmailUpdates,
            WorkoutReminders = settings.WorkoutReminders,
            NutritionTips = settings.NutritionTips,
            MarketingComm = settings.MarketingComm,
            DistanceUnit = settings.DistanceUnit,
            WeightUnit = settings.WeightUnit,
            HeightUnit = settings.HeightUnit,
            WaterUnit = settings.WaterUnit,
            TemperatureUnit = settings.TemperatureUnit,
            Theme = settings.Theme,
            ShareAnonymousData = settings.ShareAnonymousData
        };
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return null;

        return new UserProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            Phone = profile.Phone,
            Dob = profile.Dob,
            Gender = profile.Gender,
            Height = profile.Height,
            Weight = profile.Weight,
            ActivityLevel = profile.ActivityLevel
        };
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return null;

        if (request.Phone != null)
            profile.Phone = request.Phone;
        if (request.Dob.HasValue)
            profile.Dob = request.Dob;
        if (request.Gender != null)
            profile.Gender = request.Gender;
        if (request.Height != null)
            profile.Height = request.Height;
        if (request.Weight != null)
            profile.Weight = request.Weight;
        if (request.ActivityLevel != null)
            profile.ActivityLevel = request.ActivityLevel;

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return new UserProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            Phone = profile.Phone,
            Dob = profile.Dob,
            Gender = profile.Gender,
            Height = profile.Height,
            Weight = profile.Weight,
            ActivityLevel = profile.ActivityLevel
        };
    }

    public async Task LogLoginAttemptAsync(Guid? userId, string email, bool success, string? ipAddress, string? errorMessage)
    {
        var log = new LoginLog
        {
            UserId = userId,
            Email = email,
            Success = success,
            IpAddress = ipAddress,
            ErrorMessage = errorMessage
        };
        
        _context.LoginLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
