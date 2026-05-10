using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/business")]
public class BusinessController : ControllerBase
{
    private readonly IBusinessService _service;

    private readonly ILogger<BusinessController> _logger;

    public BusinessController(
        IBusinessService service,
        ILogger<BusinessController> logger)
    {
        _service = service;
        _logger = logger;
    }

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
}
