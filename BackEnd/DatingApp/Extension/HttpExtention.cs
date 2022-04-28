using Microsoft.AspNetCore.Http;
using System.Text.Json;
using Udemy.Helpers;

namespace Udemy.Extension
{
    public static class HttpExtention
    {
        public static void addPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            var option = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, option));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
