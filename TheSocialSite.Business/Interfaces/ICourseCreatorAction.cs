using TheSocialSite.Domain.Models.Course;
using TheSocialSite.Domain.Models.Response.Course;

namespace TheSocialSite.Business.Interfaces
{
    public interface ICourseCreatorAction
    {
        // Course
        CourseActionResponse GetAllCoursesAction();
        CourseActionResponse GetCourseByIdAction(int courseId);
        CourseActionResponse CreateCourseAction(CreateCourseDto dto, string authorId);
        CourseActionResponse UpdateCourseAction(int courseId, CreateCourseDto dto);
        CourseActionResponse DeleteCourseAction(int courseId);
        CourseActionResponse PublishCourseAction(int courseId);

        // Chapter
        ChapterActionResponse CreateChapterAction(CreateChapterDto dto);
        ChapterActionResponse UpdateChapterAction(int chapterId, CreateChapterDto dto);
        ChapterActionResponse DeleteChapterAction(int chapterId);

        // Lesson
        LessonActionResponse CreateLessonAction(CreateLessonDto dto);
        LessonActionResponse UpdateLessonAction(int lessonId, CreateLessonDto dto);
        LessonActionResponse DeleteLessonAction(int lessonId);

        // Block
        BlockActionResponse CreateBlockAction(CreateBlockDto dto);
        BlockActionResponse UpdateBlockAction(int blockId, CreateBlockDto dto);
        BlockActionResponse DeleteBlockAction(int blockId);
    }
}
