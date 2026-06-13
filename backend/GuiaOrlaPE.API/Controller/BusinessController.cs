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
            if (request == null || request.File == null || request.File.Length == 0)
                return BadRequest(new { message = "Nenhum arquivo enviado." });

            var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extensao = Path.GetExtension(request.File.FileName).ToLower();
            if (!extensoesPermitidas.Contains(extensao))
                return BadRequest(new { message = "Formato inválido. Use JPG, JPEG, PNG ou WEBP." });

            if (string.IsNullOrEmpty(type))
                return BadRequest(new { message = "O parâmetro 'type' é obrigatório." });

            var tipoNormalizado = type.ToLower();
            var tiposValidos = new[] { "profile", "header", "galeria" };
            if (!tiposValidos.Contains(tipoNormalizado))
                return BadRequest(new { message = "Tipo inválido. Use 'profile', 'header' ou 'galeria'." });

            var businessDto = await _service.GetByIdAsync(id);
            if (businessDto == null)
                return NotFound(new { message = "Estabelecimento não encontrado." });

            // FAXINA AUTOMÁTICA: Se for trocar a foto de Perfil ou Capa, apaga fisicamente a antiga antes
            if (tipoNormalizado == "profile" && !string.IsNullOrEmpty(businessDto.BusinessPhotoUrl))
            {
                EliminarArquivoFisico(businessDto.BusinessPhotoUrl);
            }
            else if (tipoNormalizado == "header" && !string.IsNullOrEmpty(businessDto.CoverPhotoUrl))
            {
                EliminarArquivoFisico(businessDto.CoverPhotoUrl);
            }

            var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            var nomeArquivoUnico = $"{Guid.NewGuid()}{extensao}";
            var caminhoCompleto = Path.Combine(caminhoPasta, nomeArquivoUnico);

            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var urlImagemSalva = $"/uploads/{nomeArquivoUnico}";

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
                GalleryPhotos = businessDto.GalleryPhotos ?? []
            };

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

    [HttpDelete("{id:guid}/photo")]
    [Authorize]
    public async Task<IActionResult> DeletePhoto(Guid id, [FromQuery] string type)
    {
        try
        {
            if (string.IsNullOrEmpty(type))
                return BadRequest(new { message = "O parâmetro 'type' é obrigatório." });

            var tipoNormalizado = type.ToLower();
            if (tipoNormalizado != "profile" && tipoNormalizado != "header")
                return BadRequest(new { message = "Tipo inválido para exclusão direta. Use 'profile' ou 'header'." });

            var businessDto = await _service.GetByIdAsync(id);
            if (businessDto == null)
                return NotFound(new { message = "Estabelecimento não encontrado." });

            var requestUpdate = new CreateBusinessRequest
            {
                Name = businessDto.Name, ServiceType = businessDto.ServiceType, Address = businessDto.Address,
                Latitude = businessDto.Latitude, Longitude = businessDto.Longitude, Horario = businessDto.Horario,
                Cartao = businessDto.Cartao, Pix = businessDto.Pix, Dinheiro = businessDto.Dinheiro,
                Chuveiro = businessDto.Chuveiro, Estacionamento = businessDto.Estacionamento, Cadeira = businessDto.Cadeira,
                PetFriendly = businessDto.PetFriendly, Acessibilidade = businessDto.Acessibilidade, Wifi = businessDto.Wifi,
                Description = businessDto.Description, CoverPhotoUrl = businessDto.CoverPhotoUrl,
                BusinessPhotoUrl = businessDto.BusinessPhotoUrl, GalleryPhotos = businessDto.GalleryPhotos ?? []
            };

            if (tipoNormalizado == "profile")
            {
                if (!string.IsNullOrEmpty(businessDto.BusinessPhotoUrl))
                {
                    EliminarArquivoFisico(businessDto.BusinessPhotoUrl);
                    requestUpdate.BusinessPhotoUrl = string.Empty; // Reseta no banco
                }
            }
            else if (tipoNormalizado == "header")
            {
                if (!string.IsNullOrEmpty(businessDto.CoverPhotoUrl))
                {
                    EliminarArquivoFisico(businessDto.CoverPhotoUrl);
                    requestUpdate.CoverPhotoUrl = string.Empty; // Reseta no banco
                }
            }

            await _service.UpdateAsync(id, requestUpdate, businessDto.UserId);
            return Ok(new { message = "Foto removida com sucesso física e logicamente!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao remover imagem do estabelecimento.");
            return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
        }
    }

    // NOVA ROTA ADICIONADA: Permite apagar múltiplas fotos da galeria
    [HttpDelete("{id:guid}/photo/gallery")]
    [Authorize]
    public async Task<IActionResult> DeleteGalleryPhotos(Guid id, [FromBody] DeleteGalleryPhotosRequest request)
    {
        try
        {
            if (request == null || request.Urls == null || !request.Urls.Any())
                return BadRequest(new { message = "Nenhuma URL fornecida para exclusão." });

            var businessDto = await _service.GetByIdAsync(id);
            if (businessDto == null) 
                return NotFound(new { message = "Estabelecimento não encontrado." });

            // 1. Filtra a lista da galeria, mantendo apenas as fotos que NÃO foram enviadas no body para exclusão
            var novaLista = businessDto.GalleryPhotos?.Where(p => !request.Urls.Contains(p)).ToList() ?? new List<string>();

            // 2. Destrói os arquivos físicos um por um
            foreach (var url in request.Urls)
            {
                EliminarArquivoFisico(url);
            }

            // 3. Monta o request de atualização com a nova lista de fotos
            var requestUpdate = new CreateBusinessRequest
            {
                Name = businessDto.Name, ServiceType = businessDto.ServiceType, Address = businessDto.Address,
                Latitude = businessDto.Latitude, Longitude = businessDto.Longitude, Horario = businessDto.Horario,
                Cartao = businessDto.Cartao, Pix = businessDto.Pix, Dinheiro = businessDto.Dinheiro,
                Chuveiro = businessDto.Chuveiro, Estacionamento = businessDto.Estacionamento, Cadeira = businessDto.Cadeira,
                PetFriendly = businessDto.PetFriendly, Acessibilidade = businessDto.Acessibilidade, Wifi = businessDto.Wifi,
                Description = businessDto.Description, CoverPhotoUrl = businessDto.CoverPhotoUrl,
                BusinessPhotoUrl = businessDto.BusinessPhotoUrl, GalleryPhotos = novaLista
            };

            // 4. Salva a atualização no banco de dados
            await _service.UpdateAsync(id, requestUpdate, businessDto.UserId);
            
            return Ok(new { message = "Fotos da galeria removidas com sucesso!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao remover fotos da galeria.");
            return StatusCode(500, new { message = $"Erro interno: {ex.Message}" });
        }
    }

    // MÉTODO AUXILIAR PRIVADO: Executa a destruição física do arquivo na pasta uploads
    private void EliminarArquivoFisico(string urlAmigavel)
    {
        try
        {
            // Transforma o caminho relativo "/uploads/nome.jpg" em caminho físico completo do Windows
            var nomeArquivo = Path.GetFileName(urlAmigavel);
            var caminhoFisico = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", nomeArquivo);

            if (System.IO.File.Exists(caminhoFisico))
            {
                System.IO.File.Delete(caminhoFisico);
                _logger.LogInformation("--- ARQUIVO DELETADO FISICAMENTE: {caminho} ---", caminhoFisico);
            }
        }
        catch (Exception ex)
        {
            // Loga o erro mas não quebra a requisição do usuário se o arquivo já tiver sumido por fora
            _logger.LogError(ex, "Não foi possível apagar o arquivo físico: {url}", urlAmigavel);
        }
    }
}

public class UploadImageRequest
{
    public IFormFile File { get; set; } = null!;
}

// 🌟 NOVA CLASSE DTO: Para receber o JSON com as URLs a serem deletadas
public class DeleteGalleryPhotosRequest
{
    public List<string> Urls { get; set; } = new();
}