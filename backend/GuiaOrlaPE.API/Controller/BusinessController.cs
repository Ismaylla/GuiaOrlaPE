using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Models.Responses;
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
        try { var businesses = await _service.GetAllAsync(); return Ok(businesses); }
        catch (Exception ex) { _logger.LogError(ex, "Erro interno."); return StatusCode(500, new { Message = "Erro interno." }); }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var business = await _service.GetByIdAsync(id);
            if (business is null) return NotFound(new { Message = "Não encontrado." });
            return Ok(business);
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); return StatusCode(500, new { Message = "Erro." }); }
    }

    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetByUserId()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            var paginationRequest = new PaginationRequest { Page = 1, PageSize = 1 };
            var pagedResponse = await _service.GetByUserIdAsync(userId, paginationRequest);

            if (pagedResponse.Items is null || !pagedResponse.Items.Any())
                return NotFound(new { Message = "Nenhum negócio." });

            var b = pagedResponse.Items.First();

            // Mapeamento corrigido com a propriedade Wifi inclusa!
            var response = new BusinessResponse
            {
                Id = b.Id,
                Name = b.Name,
                ServiceType = b.ServiceType,
                Address = b.Address,
                Latitude = b.Latitude,
                Longitude = b.Longitude,
                BusinessPhotoUrl = b.BusinessPhotoUrl ?? "",
                Horario = b.Horario ?? "", 
                Cartao = b.Cartao,
                Pix = b.Pix,
                Dinheiro = b.Dinheiro,
                Chuveiro = b.Chuveiro,
                Estacionamento = b.Estacionamento,
                Cadeira = b.Cadeira,
                PetFriendly = b.PetFriendly,
                Acessibilidade = b.Acessibilidade,
                Wifi = b.Wifi // <-- LINHA CORRIGIDA BEM AQUI
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar negócio do usuário.");
            return StatusCode(500, new { Message = "Erro interno ao processar dados." });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchBusinessRequest request)
    {
        try { var response = await _service.SearchAsync(request); return Ok(response); }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); return StatusCode(500, new { Message = "Erro." }); }
    }

    [HttpPost]
    [Authorize] 
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            var response = await _service.CreateAsync(request, Guid.Parse(userIdClaim));
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); return StatusCode(500, new { Message = "Erro." }); }
    }

    [HttpPut("{id:guid}")]
    [Authorize] 
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateBusinessRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            await _service.UpdateAsync(id, request, Guid.Parse(userIdClaim));
            return NoContent();
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro."); return StatusCode(500, new { Message = "Erro ao salvar." }); }
    }
}