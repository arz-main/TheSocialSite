using System;
using System.Collections.Generic;

namespace TheSocialSite.Domain.Models.Course
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string AuthorId { get; set; }
        public string AuthorUsername { get; set; }   
        public string? AuthorAvatarUrl { get; set; } 
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ChapterDto>? Chapters { get; set; }
}
