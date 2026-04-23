using Microsoft.EntityFrameworkCore;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Course;
using TheSocialSite.Domain.Models.Course;
using TheSocialSite.Domain.Models.Response.Course;

namespace TheSocialSite.Business.Core
{
    public class CourseActions
    {
        // ── COURSE ────────────────────────────────────────────────────────────

        public CourseActionResponse GetAllCoursesActionExecution()
        {
            using var ctx = new AppDbContext();

            var courses = ctx.Courses
                .Include(c => c.Author)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    ThumbnailUrl = c.ThumbnailUrl,
                    AuthorId = c.AuthorId,
                    AuthorUsername = c.Author.Username,
                    AuthorAvatarUrl = c.Author.AvatarUrl,
                    IsPublished = c.IsPublished,
                    CreatedAt = c.CreatedAt
                })
                .ToList();

            return new CourseActionResponse { IsValid = true, Message = "Courses retrieved", CourseDtos = courses };
        }

        public CourseActionResponse GetCourseByIdActionExecution(int courseId)
        {
            using var ctx = new AppDbContext();

            var c = ctx.Courses
                .Include(c => c.Author)
                .Include(c => c.Chapters.OrderBy(ch => ch.Order))
                    .ThenInclude(ch => ch.Lessons.OrderBy(l => l.Order))
                        .ThenInclude(l => l.Blocks.OrderBy(b => b.Order))
                .FirstOrDefault(c => c.Id == courseId);

            if (c == null)
                return new CourseActionResponse { IsValid = false, Message = "Course not found" };

            var dto = new CourseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ThumbnailUrl = c.ThumbnailUrl,
                AuthorId = c.AuthorId,
                AuthorUsername = c.Author.Username,
                AuthorAvatarUrl = c.Author.AvatarUrl,
                IsPublished = c.IsPublished,
                CreatedAt = c.CreatedAt,
                Chapters = c.Chapters.Select(ch => new ChapterDto
                {
                    Id = ch.Id,
                    Name = ch.Name,
                    Description = ch.Description,
                    CourseId = ch.CourseId,
                    Order = ch.Order,
                    Lessons = ch.Lessons.Select(l => new LessonDto
                    {
                        Id = l.Id,
                        Name = l.Name,
                        Description = l.Description,
                        ChapterId = l.ChapterId,
                        Order = l.Order,
                        Blocks = l.Blocks.Select(b => new BlockDto
                        {
                            Id = b.Id,
                            Type = b.Type,
                            LessonId = b.LessonId,
                            Order = b.Order,
                            TextContent = b.TextContent,
                            VideoUrl = b.VideoUrl,
                            DurationSeconds = b.DurationSeconds,
                            ImageUrl = b.ImageUrl,
                            Caption = b.Caption,
                            PracticeConfig = b.PracticeConfig
                        }).ToList()
                    }).ToList()
                }).ToList()
            };

            return new CourseActionResponse { IsValid = true, Message = "Course retrieved", CourseDto = dto };
        }

        public CourseActionResponse CreateCourseActionExecution(CreateCourseDto dto, string authorId)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return new CourseActionResponse { IsValid = false, Message = "Course name is required" };

            using var ctx = new AppDbContext();

            var author = ctx.Users.FirstOrDefault(u => u.Id == authorId);
            if (author == null)
                return new CourseActionResponse { IsValid = false, Message = "Author not found" };

            var course = new CourseData
            {
                Name = dto.Name,
                Description = dto.Description,
                ThumbnailUrl = dto.ThumbnailUrl,
                AuthorId = authorId,
                Author = author,
                IsPublished = false,
                CreatedAt = DateTime.UtcNow
            };

            ctx.Courses.Add(course);
            ctx.SaveChanges();

            return new CourseActionResponse
            {
                IsValid = true,
                Message = "Course created",
                CourseDto = new CourseDto
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    ThumbnailUrl = course.ThumbnailUrl,
                    AuthorId = course.AuthorId,
                    AuthorUsername = author.Username,
                    AuthorAvatarUrl = author.AvatarUrl,
                    IsPublished = course.IsPublished,
                    CreatedAt = course.CreatedAt
                }
            };
        }

        public CourseActionResponse UpdateCourseActionExecution(int courseId, CreateCourseDto dto)
        {
            using var ctx = new AppDbContext();

            var course = ctx.Courses.FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                return new CourseActionResponse { IsValid = false, Message = "Course not found" };

            course.Name = dto.Name;
            course.Description = dto.Description;
            course.ThumbnailUrl = dto.ThumbnailUrl;
            ctx.SaveChanges();

            return new CourseActionResponse { IsValid = true, Message = "Course updated" };
        }

        public CourseActionResponse DeleteCourseActionExecution(int courseId)
        {
            using var ctx = new AppDbContext();

            var course = ctx.Courses.FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                return new CourseActionResponse { IsValid = false, Message = "Course not found" };

            ctx.Courses.Remove(course);
            ctx.SaveChanges();

            return new CourseActionResponse { IsValid = true, Message = "Course deleted" };
        }

        public CourseActionResponse PublishCourseActionExecution(int courseId)
        {
            using var ctx = new AppDbContext();

            var course = ctx.Courses.FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                return new CourseActionResponse { IsValid = false, Message = "Course not found" };

            course.IsPublished = !course.IsPublished;
            ctx.SaveChanges();

            var msg = course.IsPublished ? "Course published" : "Course unpublished";
            return new CourseActionResponse { IsValid = true, Message = msg };
        }

        // ── CHAPTER ───────────────────────────────────────────────────────────

        public ChapterActionResponse CreateChapterActionExecution(CreateChapterDto dto)
        {
            using var ctx = new AppDbContext();

            if (!ctx.Courses.Any(c => c.Id == dto.CourseId))
                return new ChapterActionResponse { IsValid = false, Message = "Course not found" };

            var chapter = new ChapterData
            {
                Name = dto.Name,
                Description = dto.Description,
                CourseId = dto.CourseId,
                Order = dto.Order
            };

            ctx.Chapters.Add(chapter);
            ctx.SaveChanges();

            return new ChapterActionResponse
            {
                IsValid = true,
                Message = "Chapter created",
                ChapterDto = new ChapterDto
                {
                    Id = chapter.Id,
                    Name = chapter.Name,
                    Description = chapter.Description,
                    CourseId = chapter.CourseId,
                    Order = chapter.Order
                }
            };
        }

        public ChapterActionResponse UpdateChapterActionExecution(int chapterId, CreateChapterDto dto)
        {
            using var ctx = new AppDbContext();

            var chapter = ctx.Chapters.FirstOrDefault(c => c.Id == chapterId);
            if (chapter == null)
                return new ChapterActionResponse { IsValid = false, Message = "Chapter not found" };

            chapter.Name = dto.Name;
            chapter.Description = dto.Description;
            chapter.Order = dto.Order;
            ctx.SaveChanges();

            return new ChapterActionResponse { IsValid = true, Message = "Chapter updated" };
        }

        public ChapterActionResponse DeleteChapterActionExecution(int chapterId)
        {
            using var ctx = new AppDbContext();

            var chapter = ctx.Chapters.FirstOrDefault(c => c.Id == chapterId);
            if (chapter == null)
                return new ChapterActionResponse { IsValid = false, Message = "Chapter not found" };

            ctx.Chapters.Remove(chapter);
            ctx.SaveChanges();

            return new ChapterActionResponse { IsValid = true, Message = "Chapter deleted" };
        }

        // ── LESSON ────────────────────────────────────────────────────────────

        public LessonActionResponse CreateLessonActionExecution(CreateLessonDto dto)
        {
            using var ctx = new AppDbContext();

            if (!ctx.Chapters.Any(c => c.Id == dto.ChapterId))
                return new LessonActionResponse { IsValid = false, Message = "Chapter not found" };

            var lesson = new LessonData
            {
                Name = dto.Name,
                Description = dto.Description,
                ChapterId = dto.ChapterId,
                Order = dto.Order
            };

            ctx.Lessons.Add(lesson);
            ctx.SaveChanges();

            return new LessonActionResponse
            {
                IsValid = true,
                Message = "Lesson created",
                LessonDto = new LessonDto
                {
                    Id = lesson.Id,
                    Name = lesson.Name,
                    Description = lesson.Description,
                    ChapterId = lesson.ChapterId,
                    Order = lesson.Order
                }
            };
        }

        public LessonActionResponse UpdateLessonActionExecution(int lessonId, CreateLessonDto dto)
        {
            using var ctx = new AppDbContext();

            var lesson = ctx.Lessons.FirstOrDefault(l => l.Id == lessonId);
            if (lesson == null)
                return new LessonActionResponse { IsValid = false, Message = "Lesson not found" };

            lesson.Name = dto.Name;
            lesson.Description = dto.Description;
            lesson.Order = dto.Order;
            ctx.SaveChanges();

            return new LessonActionResponse { IsValid = true, Message = "Lesson updated" };
        }

        public LessonActionResponse DeleteLessonActionExecution(int lessonId)
        {
            using var ctx = new AppDbContext();

            var lesson = ctx.Lessons.FirstOrDefault(l => l.Id == lessonId);
            if (lesson == null)
                return new LessonActionResponse { IsValid = false, Message = "Lesson not found" };

            ctx.Lessons.Remove(lesson);
            ctx.SaveChanges();

            return new LessonActionResponse { IsValid = true, Message = "Lesson deleted" };
        }

        // ── BLOCK ─────────────────────────────────────────────────────────────

        public BlockActionResponse CreateBlockActionExecution(CreateBlockDto dto)
        {
            using var ctx = new AppDbContext();

            if (!ctx.Lessons.Any(l => l.Id == dto.LessonId))
                return new BlockActionResponse { IsValid = false, Message = "Lesson not found" };

            var block = new BlockData
            {
                Type = dto.Type,
                LessonId = dto.LessonId,
                Order = dto.Order,
                TextContent = dto.TextContent,
                VideoUrl = dto.VideoUrl,
                DurationSeconds = dto.DurationSeconds,
                ImageUrl = dto.ImageUrl,
                Caption = dto.Caption,
                PracticeConfig = dto.PracticeConfig
            };

            ctx.Blocks.Add(block);
            ctx.SaveChanges();

            return new BlockActionResponse
            {
                IsValid = true,
                Message = "Block created",
                BlockDto = new BlockDto
                {
                    Id = block.Id,
                    Type = block.Type,
                    LessonId = block.LessonId,
                    Order = block.Order,
                    TextContent = block.TextContent,
                    VideoUrl = block.VideoUrl,
                    DurationSeconds = block.DurationSeconds,
                    ImageUrl = block.ImageUrl,
                    Caption = block.Caption,
                    PracticeConfig = block.PracticeConfig
                }
            };
        }

        public BlockActionResponse UpdateBlockActionExecution(int blockId, CreateBlockDto dto)
        {
            using var ctx = new AppDbContext();

            var block = ctx.Blocks.FirstOrDefault(b => b.Id == blockId);
            if (block == null)
                return new BlockActionResponse { IsValid = false, Message = "Block not found" };

            block.Type = dto.Type;
            block.Order = dto.Order;
            block.TextContent = dto.TextContent;
            block.VideoUrl = dto.VideoUrl;
            block.DurationSeconds = dto.DurationSeconds;
            block.ImageUrl = dto.ImageUrl;
            block.Caption = dto.Caption;
            block.PracticeConfig = dto.PracticeConfig;
            ctx.SaveChanges();

            return new BlockActionResponse { IsValid = true, Message = "Block updated" };
        }

        public BlockActionResponse DeleteBlockActionExecution(int blockId)
        {
            using var ctx = new AppDbContext();

            var block = ctx.Blocks.FirstOrDefault(b => b.Id == blockId);
            if (block == null)
                return new BlockActionResponse { IsValid = false, Message = "Block not found" };

            ctx.Blocks.Remove(block);
            ctx.SaveChanges();

            return new BlockActionResponse { IsValid = true, Message = "Block deleted" };
        }
    }
}
