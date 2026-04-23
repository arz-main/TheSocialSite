using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Course;
using TheSocialSite.Domain.Models.Response.Course;

namespace TheSocialSite.Business.Structure
{
    public class CourseCreateInteractAction : CourseActions, ICourseCreatorAction
    {
        // Course
        public CourseActionResponse GetAllCoursesAction() => GetAllCoursesActionExecution();
        public CourseActionResponse GetCourseByIdAction(int courseId) => GetCourseByIdActionExecution(courseId);
        public CourseActionResponse CreateCourseAction(CreateCourseDto dto, string authorId) => CreateCourseActionExecution(dto, authorId);
        public CourseActionResponse UpdateCourseAction(int courseId, CreateCourseDto dto) => UpdateCourseActionExecution(courseId, dto);
        public CourseActionResponse DeleteCourseAction(int courseId) => DeleteCourseActionExecution(courseId);
        public CourseActionResponse PublishCourseAction(int courseId) => PublishCourseActionExecution(courseId);

        // Chapter
        public ChapterActionResponse CreateChapterAction(CreateChapterDto dto) => CreateChapterActionExecution(dto);
        public ChapterActionResponse UpdateChapterAction(int chapterId, CreateChapterDto dto) => UpdateChapterActionExecution(chapterId, dto);
        public ChapterActionResponse DeleteChapterAction(int chapterId) => DeleteChapterActionExecution(chapterId);

        // Lesson
        public LessonActionResponse CreateLessonAction(CreateLessonDto dto) => CreateLessonActionExecution(dto);
        public LessonActionResponse UpdateLessonAction(int lessonId, CreateLessonDto dto) => UpdateLessonActionExecution(lessonId, dto);
        public LessonActionResponse DeleteLessonAction(int lessonId) => DeleteLessonActionExecution(lessonId);

        // Block
        public BlockActionResponse CreateBlockAction(CreateBlockDto dto) => CreateBlockActionExecution(dto);
        public BlockActionResponse UpdateBlockAction(int blockId, CreateBlockDto dto) => UpdateBlockActionExecution(blockId, dto);
        public BlockActionResponse DeleteBlockAction(int blockId) => DeleteBlockActionExecution(blockId);
    }
}
