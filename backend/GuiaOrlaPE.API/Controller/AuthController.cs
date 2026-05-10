using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _service;

    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserService service,
        ILogger<AuthController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando tentativa de login. Email: {Email}",
                request.Email);

            var response = await _service.LoginAsync(request);

            _logger.LogInformation(
                "Login realizado com sucesso. Email: {Email}",
                request.Email);

            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(
                ex,
                "Falha de autenticação. Email: {Email}",
                request.Email);

            return Unauthorized(new
            {
                ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro interno durante login. Email: {Email}",
                request.Email);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }
}