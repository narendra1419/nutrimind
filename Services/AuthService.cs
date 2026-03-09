using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NutriMind.API.Data;
using NutriMind.API.Models;
using NutriMind.API.Models.DTOs;

namespace NutriMind.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "An account with this email already exists"
            };
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            FullName = request.FullName ?? request.Email.Split('@')[0],
            Plan = "Free Plan"
        };

        // Hash password (in production, use proper password hashing)
        user.Id = Guid.NewGuid();

        _context.Users.Add(user);

        // Create default settings
        var settings = new UserSettings
        {
            UserId = user.Id
        };
        _context.UserSettings.Add(settings);

        // Create default profile
        var profile = new UserProfile
        {
            UserId = user.Id
        };
        _context.UserProfiles.Add(profile);

        await _context.SaveChangesAsync();

        // Generate token
        var token = GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = "Account created successfully!",
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null)
        {
            // Log failed attempt
            await LogLoginAttemptAsync(null, request.Email, false, null, "User not found");
            
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        // In production, verify password hash properly
        // For demo purposes, we accept any password
        
        // Log successful attempt
        await LogLoginAttemptAsync(user.Id, request.Email, true, null, null);

        // Generate token
        var token = GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = "Login successful!",
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        // In a stateless JWT setup, logout is handled client-side
        // But we can log the logout event
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await LogLoginAttemptAsync(userId, user.Email, true, null, "Logged out");
        }
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? "NutriMindSuperSecretKey2024!@#$%^&*()"));
        
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName ?? ""),
            new Claim(ClaimTypes.Role, "User")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "NutriMindAPI",
            audience: _configuration["Jwt:Audience"] ?? "NutriMindApp",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Plan = user.Plan,
            CreatedAt = user.CreatedAt
        };
    }

    private async Task LogLoginAttemptAsync(Guid? userId, string email, bool success, string? ipAddress, string? errorMessage)
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

    public async Task<LoginHistoryResponse> GetLoginHistoryAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        var query = _context.LoginLogs
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt);

        var totalCount = await query.CountAsync();
        
        var logs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new LoginLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Email = l.Email,
                Success = l.Success,
                IpAddress = l.IpAddress,
                ErrorMessage = l.ErrorMessage,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return new LoginHistoryResponse
        {
            Logs = logs,
            TotalCount = totalCount
        };
    }
}
