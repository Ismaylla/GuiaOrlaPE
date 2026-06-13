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

            var response = new BusinessResponse
            {
                Id = b.Id,
                UserId = b.UserId,
                Name = b.Name,
                ServiceType = b.ServiceType,
                Address = b.Address,
                Latitude = b.Latitude,
                Longitude = b.Longitude,
                BusinessPhotoUrl = b.BusinessPhotoUrl ?? "",
                CoverPhotoUrl = b.CoverPhotoUrl ?? "", 
                Horario = b.Horario ?? "", 
                Cartao = b.Cartao,
                Pix = b.Pix,
                Dinheiro = b.Dinheiro,
                Chuveiro = b.Chuveiro,
                Estacionamento = b.Estacionamento,
                Cadeira = b.Cadeira,
                PetFriendly = b.PetFriendly,
                Acessibilidade = b.Acessibilidade,
                Wifi = b.Wifi,
                Description = b.Description ?? "", 
                GalleryPhotos = b.GalleryPhotos ?? [] 
            };

            return Ok(response);
        }
        catch (Exception ex) { _logger.LogError(ex, "Erro ao buscar negócio do usuário."); return StatusCode(500, new { Message = "Erro interno ao processar dados." }); }
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

    [HttpPost("{id:guid}/upload")]
    [Authorize]
    public async Task<IActionResult> UploadImage(Guid id, [FromForm] UploadImageRequest request, [FromQuery] string type)
    {
        try
        {
            // Validações básicas de upload de arquivos
            if (request == null || request.File == null || request.File.Length == 0)
                return BadRequest(new { message = "Nenhum arquivo enviado." });

            var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extensao = Path.GetExtension(request.File.FileName).ToLower();
            if (!extensoesPermitidas.Contains(extensao))
                return BadRequest(new { message = "Formato inválido. Use JPG, JPEG, PNG ou WEBP." });

            if (string.IsNullOrEmpty(type))
                return BadRequest(new { message = "O parâmetro 'type' é obrigatório." });

            // Validações de tipo aceito antes de criar o arquivo físico em disco para economizar armazenamento
            var tipoNormalizado = type.ToLower();
            var tiposValidos = new[] { "profile", "header", "galeria" };
            if (!tiposValidos.Contains(tipoNormalizado))
                return BadRequest(new { message = "Tipo inválido. Use 'profile', 'header' ou 'galeria'." });

            var businessDto = await _service.GetByIdAsync(id);
            if (businessDto == null)
                return NotFound(new { message = "Estabelecimento não encontrado." });

            // Processamento físico de armazenamento das imagens estáticas
            var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            var nomeArquivoUnico = $"{Guid.NewGuid()}{extensao}";
            var caminhoCompleto = Path.Combine(caminhoPasta, nomeArquivoUnico);

            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var urlImagemSalva = $"/uploads/{nomeArquivoUnico}";

            // Instanciação e cópia do DTO para persistência das propriedades existentes do negócio
            var requestUpdate = new CreateBusinessRequest
            {
                Name = businessDto.Name,
                ServiceType = businessDto.ServiceType,
                Address = businessDto.Address,
                Latitude = businessDto.Latitude,
                Longitude = businessDto.Longitude,
                Horario = businessDto.Horario,
                Cartao = businessDto.Cartao,
                Pix = businessDto.Pix,
                Dinheiro = businessDto.Dinheiro,
                Chuveiro = businessDto.Chuveiro,
                Estacionamento = businessDto.Estacionamento,
                Cadeira = businessDto.Cadeira,
                PetFriendly = businessDto.PetFriendly,
                Acessibilidade = businessDto.Acessibilidade,
                Wifi = businessDto.Wifi,
                Description = businessDto.Description,
                CoverPhotoUrl = businessDto.CoverPhotoUrl,
                BusinessPhotoUrl = businessDto.BusinessPhotoUrl,
                // CORRIGIDO: Copia a lista atual de fotos da galeria para evitar que ela seja limpa no update
                GalleryPhotos = businessDto.GalleryPhotos ?? []
            };

            // Bloco lógico de roteamento de propriedades de acordo com o tipo recebido por QueryString
            if (tipoNormalizado == "profile")
            {
                requestUpdate.BusinessPhotoUrl = urlImagemSalva;
            }
            else if (tipoNormalizado == "header")
            {
                requestUpdate.CoverPhotoUrl = urlImagemSalva;
            }
            else if (tipoNormalizado == "galeria")
            {
                // ADICIONADO: Se for galeria, adiciona o novo caminho de arquivo ao array existente de imagens
                var listaFotos = requestUpdate.GalleryPhotos.ToList();
                listaFotos.Add(urlImagemSalva);
                requestUpdate.GalleryPhotos = listaFotos;
            }

            await _service.UpdateAsync(id, requestUpdate, businessDto.UserId);

            return Ok(new { url = urlImagemSalva, message = "Upload realizado com sucesso!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao realizar upload da imagem.");
            return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
        }
    }
}

public class UploadImageRequest
{
    public IFormFile File { get; set; } = null!;
}