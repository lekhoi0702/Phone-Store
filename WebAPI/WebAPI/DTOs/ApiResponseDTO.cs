namespace WebAPI.DTOs
{
    public class ApiResponseDTO<T>
    {
        public bool Success { get; set; }
        public List<String> Error { get; set; } = new List<String>();
        public string Message { get; set; }
        public T? Data { get; set; }
    }
}
