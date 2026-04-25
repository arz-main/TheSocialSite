using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheSocialSite.Domain.Entities.Course
{
    public class LessonData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        [Required]
        public int ChapterId { get; set; }

        [ForeignKey("ChapterId")]
        public ChapterData Chapter { get; set; }

        [Required]
        public int Order { get; set; }

        public List<BlockData> Blocks { get; set; } = new();
    }
}
