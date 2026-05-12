using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Repository.Intefaces;
using Microsoft.EntityFrameworkCore;

namespace GuiaOrlaPE.API.Repository.Implementation;

public class BusinessRepository : IBusinessRepository
{
    private readonly AppDbContext _context;

    public BusinessRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Business>> GetAllAsync()
    {
        return await _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Business?> GetByIdAsync(Guid id)
    {
        return await _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(List<Business> Items, int TotalItems)> SearchAsync(string? search, int page, int pageSize)
    {
        var query = _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim().ToLower();

            query = query.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Address.ToLower().Contains(search));
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<(List<Business> Items, int TotalItems)> GetByUserIdAsync(Guid userId, int page,int pageSize)
    {
        var query = _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .Where(x => x.UserId == userId);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalItems);
    }
}
