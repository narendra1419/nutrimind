using System.Net.Http.Json;
using System.Text.Json;

namespace NutriMind.API.Services;

public interface IAICoachService
{
    Task<string> GetAIResponseAsync(string userMessage, object? userContext = null);
}

public class AICoachService : IAICoachService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AICoachService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GetAIResponseAsync(string userMessage, object? userContext = null)
    {
        // First try NVIDIA API, then fall back to OpenAI
        var nvidiaApiKey = _configuration["OpenAI:NVIDIA_API_Key"];
        var openAiApiKey = _configuration["OpenAI:ApiKey"];
        
        // Try NVIDIA first
        if (!string.IsNullOrEmpty(nvidiaApiKey))
        {
            try
            {
                var nvidiaResponse = await GetNVIDIAResponseAsync(userMessage, userContext, nvidiaApiKey);
                if (!string.IsNullOrEmpty(nvidiaResponse))
                {
                    return nvidiaResponse;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"NVIDIA API Error: {ex.Message}");
            }
        }
        
        // Try OpenAI if NVIDIA failed or not configured
        if (!string.IsNullOrEmpty(openAiApiKey))
        {
            try
            {
                var openAiResponse = await GetOpenAIResponseAsync(userMessage, userContext, openAiApiKey);
                if (!string.IsNullOrEmpty(openAiResponse))
                {
                    return openAiResponse;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OpenAI API Error: {ex.Message}");
            }
        }

        // If no API key configured, return fallback response
        return GetFallbackResponse(userMessage);
    }

    private async Task<string> GetNVIDIAResponseAsync(string userMessage, object? userContext, string apiKey)
    {
        // Build context from user data if available
        var contextInfo = "";
        if (userContext != null)
        {
            try
            {
                var json = JsonSerializer.Serialize(userContext);
                contextInfo = $"\n\nUser's current data: {json}";
            }
            catch { }
        }

        var systemPrompt = $@"You are FitCoach AI, a friendly and knowledgeable personal fitness coach for the NutriMind app. 

Your role is to help users with:
- Workout recommendations and exercise form tips
- Nutrition and meal planning advice
- Goal setting and progress tracking
- Motivation and accountability
- Health insights based on their vitals

Guidelines:
- Be encouraging and supportive
- Provide specific, actionable advice
- Use emojis to make responses friendly
- Keep responses concise but informative
- When discussing numbers, refer to user's actual data
- Never provide medical advice - always suggest consulting a healthcare professional for medical questions
- Be honest about limitations{contextInfo}";

        var requestBody = new
        {
            model = "nvidia/llama-3.1-nemotron-70b-instruct",
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userMessage }
            },
            temperature = 0.7,
            max_tokens = 500
        };

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        _httpClient.DefaultRequestHeaders.Add("accept", "application/json");

        var response = await _httpClient.PostAsJsonAsync(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            requestBody
        );

        if (!response.IsSuccessStatusCode)
        {
            return string.Empty;
        }

        var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
        return result?.Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;
    }

    private async Task<string> GetOpenAIResponseAsync(string userMessage, object? userContext, string apiKey)
    {
        // Build context from user data if available
        var contextInfo = "";
        if (userContext != null)
        {
            try
            {
                var json = JsonSerializer.Serialize(userContext);
                contextInfo = $"\n\nUser's current data: {json}";
            }
            catch { }
        }

        var systemPrompt = $@"You are FitCoach AI, a friendly and knowledgeable personal fitness coach for the NutriMind app. 

Your role is to help users with:
- Workout recommendations and exercise form tips
- Nutrition and meal planning advice
- Goal setting and progress tracking
- Motivation and accountability
- Health insights based on their vitals

Guidelines:
- Be encouraging and supportive
- Provide specific, actionable advice
- Use emojis to make responses friendly
- Keep responses concise but informative
- When discussing numbers, refer to user's actual data
- Never provide medical advice - always suggest consulting a healthcare professional for medical questions
- Be honest about limitations{contextInfo}";

        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userMessage }
            },
            temperature = 0.7,
            max_tokens = 500
        };

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var response = await _httpClient.PostAsJsonAsync(
            "https://api.openai.com/v1/chat/completions",
            requestBody
        );

        if (!response.IsSuccessStatusCode)
        {
            return string.Empty;
        }

        var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
        return result?.Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;
    }

    private string GetFallbackResponse(string message)
    {
        // Fallback to keyword-based responses
        var m = message.ToLower();
        
        if (m.Contains("workout") || m.Contains("exercise") || m.Contains("training"))
        {
            return "I'd love to help with your workout questions! 🏋️\n\n" +
                   "For a balanced fitness routine, I recommend:\n" +
                   "• Strength training: 3-4 times per week\n" +
                   "• Cardio: 30-45 minutes, 3-4 times per week\n" +
                   "• Rest: At least 1-2 days per week\n\n" +
                   "What's your current fitness goal? I can provide more specific recommendations!";
        }
        
        if (m.Contains("meal") || m.Contains("food") || m.Contains("nutrition") || m.Contains("eat"))
        {
            return "Great question about nutrition! 🥗\n\n" +
                   "For optimal fitness, focus on:\n" +
                   "• Protein: 1.6-2g per kg of body weight\n" +
                   "• Carbs: Energy for workouts\n" +
                   "• Healthy fats: Hormone balance\n" +
                   "• Stay hydrated: 2-3L water daily\n\n" +
                   "Would you like a personalized meal plan?";
        }
        
        if (m.Contains("goal") || m.Contains("progress"))
        {
            return "Goals keep us motivated! 🎯\n\n" +
                   "Tips for effective goal setting:\n" +
                   "• Make them specific and measurable\n" +
                   "• Set realistic timelines\n" +
                   "• Break big goals into smaller steps\n" +
                   "• Track your progress regularly\n\n" +
                   "What goals are you working on right now?";
        }
        
        if (m.Contains("vital") || m.Contains("heart") || m.Contains("health"))
        {
            return "Monitoring vitals is great for health! ❤️\n\n" +
                   "Key metrics to track:\n" +
                   "• Heart rate: 60-100 bpm is normal\n" +
                   "• Blood pressure: Around 120/80\n" +
                   "• Sleep: 7-9 hours per night\n" +
                   "• Recovery: Listen to your body\n\n" +
                   "Note: Always consult a healthcare provider for medical advice!";
        }
        
        return "Hey there! 👋 I'm your AI fitness coach!\n\n" +
               "I can help you with:\n" +
               "🏋️ Workout recommendations\n" +
               "🥗 Nutrition & meal planning\n" +
               "🎯 Goal setting & progress\n" +
               "❤️ Health & vitals insights\n\n" +
               "What would you like to know more about?";
    }
}

// OpenAI API Response classes
public class OpenAIResponse
{
    public List<OpenAIChoice>? Choices { get; set; }
}

public class OpenAIChoice
{
    public OpenAIMessage? Message { get; set; }
}

public class OpenAIMessage
{
    public string? Content { get; set; }
}
