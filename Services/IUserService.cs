using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

public interface IUserService
{
    Task<UserDto?> GetUserAsync(Guid userId);
    Task<UserDto?> UpdateUserAsync(Guid userId, UpdateUserRequest request);
    Task<UserSettingsDto?> GetSettingsAsync(Guid userId);
    Task<UserSettingsDto?> UpdateSettingsAsync(Guid userId, UpdateSettingsRequest request);
    Task<UserProfileDto?> GetProfileAsync(Guid userId);
    Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task LogLoginAttemptAsync(Guid? userId, string email, bool success, string? ipAddress, string? errorMessage);
}
