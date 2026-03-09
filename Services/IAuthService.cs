using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(Guid userId);
    Task<LoginHistoryResponse> GetLoginHistoryAsync(Guid userId, int page = 1, int pageSize = 10);
}
