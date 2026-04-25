using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Course;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseCreatorController : ControllerBase
    {
        private readonly ICourseCreatorAction _courseAction;

        public CourseCreatorController()
        {
            var bl = new BusinessLogic();
            _courseAction = bl.CourseCreateInteractAction();
        }

        // ── READ (any authenticated user) ────────────────────────────────────

        [HttpGet]
        [Authorize]
        public IActionResult GetAllCourses()
        {
            var response = _courseAction.GetAllCoursesAction();
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.CourseDtos);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetCourseById([FromRoute] int id)
        {
            var response = _courseAction.GetCourseByIdAction(id);
            if (!response.IsValid)
                return NotFound(response.Message);

            return Ok(response.CourseDto);
        }

        // ── COURSE MUTATIONS (admin only) ─────────────────────────────────────

        [HttpPost]
        [Authorize]
        public IActionResult CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var authorId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var response = _courseAction.CreateCourseAction(dto, authorId);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.CourseDto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateCourse([FromRoute] int id, [FromBody] CreateCourseDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.UpdateCourseAction(id, dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteCourse([FromRoute] int id)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.DeleteCourseAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpPatch("{id}/publish")]
        [Authorize]
        public IActionResult TogglePublish([FromRoute] int id)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.PublishCourseAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        // ── CHAPTER MUTATIONS (admin only) ────────────────────────────────────

        [HttpPost("chapters")]
        [Authorize]
        public IActionResult CreateChapter([FromBody] CreateChapterDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.CreateChapterAction(dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.ChapterDto);
        }

        [HttpPut("chapters/{id}")]
        [Authorize]
        public IActionResult UpdateChapter([FromRoute] int id, [FromBody] CreateChapterDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.UpdateChapterAction(id, dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpDelete("chapters/{id}")]
        [Authorize]
        public IActionResult DeleteChapter([FromRoute] int id)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.DeleteChapterAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        // ── LESSON MUTATIONS (admin only) ─────────────────────────────────────

        [HttpPost("lessons")]
        [Authorize]
        public IActionResult CreateLesson([FromBody] CreateLessonDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.CreateLessonAction(dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.LessonDto);
        }

        [HttpPut("lessons/{id}")]
        [Authorize]
        public IActionResult UpdateLesson([FromRoute] int id, [FromBody] CreateLessonDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.UpdateLessonAction(id, dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpDelete("lessons/{id}")]
        [Authorize]
        public IActionResult DeleteLesson([FromRoute] int id)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.DeleteLessonAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        // ── BLOCK MUTATIONS (admin only) ──────────────────────────────────────

        [HttpPost("blocks")]
        [Authorize]
        public IActionResult CreateBlock([FromBody] CreateBlockDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.CreateBlockAction(dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.BlockDto);
        }

        [HttpPut("blocks/{id}")]
        [Authorize]
        public IActionResult UpdateBlock([FromRoute] int id, [FromBody] CreateBlockDto dto)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.UpdateBlockAction(id, dto);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpDelete("blocks/{id}")]
        [Authorize]
        public IActionResult DeleteBlock([FromRoute] int id)
        {
            if (!User.IsInRole("Admin")) return Forbid();

            var response = _courseAction.DeleteBlockAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }
    }
}
