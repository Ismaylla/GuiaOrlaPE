using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IUserService service,
    ILogger<AuthController> logger) : ControllerBase
{
    private readonly IUserService _userService = service;

    private readonly ILogger<AuthController> _logger = logger;

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando tentativa de login. Email: {Email}",
                request.Email);

            var response = await _userService.LoginAsync(request);

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
    
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _userService.ForgotPasswordAsync(request.Email);
            return Ok(new { message = "Senha redefinida com sucesso. Verifique seu e-mail." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro na recuperação de senha.");
            return StatusCode(500, new { message = "Erro ao processar solicitação." });
        }
    }


}