using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/business")]
public class BusinessController(
    IBusinessService service,
    ILogger<BusinessController> logger) : ControllerBase
{
    private readonly IBusinessService _service = service;
    private readonly ILogger<BusinessController> _logger = logger;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var businesses = await _service.GetAllAsync();
            return Ok(businesses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao listar empreendimentos.");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { Message = "Erro interno do servidor." });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var business = await _service.GetByIdAsync(id);

            if (business is null)
            {
                return NotFound(new { Message = "Empreendimento não encontrado." });
            }

            return Ok(business);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao buscar empreendimento.");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { Message = "Erro interno do servidor." });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchBusinessRequest request)
    {
        try
        {
            _logger.LogInformation("Recebida requisição de busca paginada de empreendimentos.");
            var response = await _service.SearchAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao buscar empreendimentos.");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { Message = "Erro interno do servidor." });
        }
    }

    [HttpPost]
    [Authorize] // Garante que apenas usuários autenticados com JWT criem negócios
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest request)
    {
        try
        {
            _logger.LogInformation("Recebida requisição para cadastrar novo empreendimento: {Name}", request.Name);
            
            // Extrai o ID do usuário autenticado no token (Claim NameIdentifier)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { Message = "Usuário não identificado no token de autenticação." });
            }

            var userId = Guid.Parse(userIdClaim);

            // Ajustado: Passando o request e o userId obtido com segurança
            var response = await _service.CreateAsync(request, userId);
            
            // Retorna o status 201 Created apontando para o endpoint do GetById com o novo id gerado
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao cadastrar empreendimento.");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { Message = "Erro interno do servidor." });
        }
    }
}