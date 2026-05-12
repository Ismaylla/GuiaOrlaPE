using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
            _logger.LogError(
                ex,
                "Erro interno ao listar empreendimentos.");

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
            var business = await _service.GetByIdAsync(id);

            if (business is null)
            {
                return NotFound(new
                {
                    Message = "Empreendimento não encontrado."
                });
            }

            return Ok(business);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro interno ao buscar empreendimento.");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchBusinessRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Recebida requisição de busca paginada de empreendimentos.");

            var response = await _service.SearchAsync(request);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro interno ao buscar empreendimentos.");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    Message = "Erro interno do servidor."
                });
        }
    }
}
