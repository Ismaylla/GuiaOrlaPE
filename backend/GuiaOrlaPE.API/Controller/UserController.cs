using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    private readonly ILogger<UserController> _logger;

    public UserController(
        IUserService service,
        ILogger<UserController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost("businessperson")]
    public async Task<IActionResult> CreateBusinessperson(
        [FromBody] CreateBusinesspersonRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando cadastro de usuário Businessperson. Email: {Email}",
                request.Email);

            var user = await _service.CreateBusinesspersonAsync(request);

            _logger.LogInformation(
                "Usuário Businessperson cadastrado com sucesso. UserId: {UserId}",
                user.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = user.Id },
                user);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao cadastrar usuário Businessperson. Email: {Email}",
                request.Email);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            _logger.LogInformation(
                "Iniciando busca de usuários.");

            var users = await _service.GetAllAsync();

            _logger.LogInformation(
                "Busca de usuários realizada com sucesso. Quantidade: {Count}",
                users.Count);

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao buscar usuários.");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            _logger.LogInformation(
                "Buscando usuário por id. UserId: {UserId}",
                id);

            var user = await _service.GetByIdAsync(id);

            if (user is null)
            {
                _logger.LogWarning(
                    "Usuário não encontrado. UserId: {UserId}",
                    id);

                return NotFound(new
                {
                    Message = "Usuário não encontrado."
                });
            }

            _logger.LogInformation(
                "Usuário encontrado com sucesso. UserId: {UserId}",
                id);

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao buscar usuário por id. UserId: {UserId}",
                id);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] CreateBusinesspersonRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando atualização de usuário. UserId: {UserId}",
                id);

            await _service.UpdateAsync(id, request);

            _logger.LogInformation(
                "Usuário atualizado com sucesso. UserId: {UserId}",
                id);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao atualizar usuário. UserId: {UserId}",
                id);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }
}