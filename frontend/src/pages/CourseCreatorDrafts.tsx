import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Plus, BookOpen, Layers, Globe, EyeOff, Trash2,
    Edit3, Calendar, User, Search,
    BarChart2, Clock,
} from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import type { CourseDto } from '../types/CourseTypes';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import paths from '../routes/paths';

type Filter = 'all' | 'published' | 'draft';

function StatusBadge({ published }: { published: boolean }) {
    return published
        ? <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            <Globe className="w-2.5 h-2.5" /> Published
          </span>
        : <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <EyeOff className="w-2.5 h-2.5" /> Draft
          </span>;
}

function CourseCard({
    course, index, onEdit, onTogglePublish, onDelete, deleting, toggling,
}: {
    course: CourseDto;
    index: number;
    onEdit: () => void;
    onTogglePublish: () => void;
    onDelete: () => void;
    deleting: boolean;
    toggling: boolean;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const createdAt = course.createdAt
        ? new Date(course.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.22 }}
            className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
        >
            {/* Cover */}
            <div className="relative h-36 bg-muted/20 overflow-hidden">
                {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-muted/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                    <StatusBadge published={course.isPublished} />
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-black text-text leading-snug mb-1 line-clamp-1">{course.name || 'Untitled'}</h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{course.description || 'No description.'}</p>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[11px] text-muted flex-wrap">
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {course.authorAvatarUrl
                            ? <img src={course.authorAvatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                            : null
                        }
                        {course.authorUsername ?? '—'}
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{createdAt}</span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {course.chapters?.length ?? 0} ch
                    </span>
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.chapters?.reduce((s, ch) => s + (ch.lessons?.length ?? 0), 0) ?? 0} lessons
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-border/60" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                    >
                        <Edit3 className="w-3 h-3" /> Edit
                    </button>

                    <button
                        onClick={onTogglePublish}
                        disabled={toggling}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors disabled:opacity-50 ${
                            course.isPublished
                                ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                                : 'border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10'
                        }`}
                    >
                        {course.isPublished ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Globe className="w-3 h-3" /> Publish</>}
                    </button>

                    <div className="flex-1" />

                    {confirmDelete ? (
                        <div className="flex items-center gap-1">
                            <button onClick={() => setConfirmDelete(false)}
                                className="px-2 py-1 rounded-lg text-xs text-muted hover:text-text border border-border transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => { onDelete(); setConfirmDelete(false); }} disabled={deleting}
                                className="px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                                {deleting ? 'Deleting…' : 'Confirm'}
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setConfirmDelete(true)}
                            className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function CourseCreatorDrafts() {
    const navigate = useNavigate();
    const { getAllCourses, publishCourse, deleteCourse } = useCourses();

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = () => {
        setLoading(true);
        getAllCourses()
            .then(setCourses)
            .catch(() => setError('Failed to load courses'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleTogglePublish = async (course: CourseDto) => {
        setTogglingId(course.id);
        try {
            await publishCourse(course.id);
            setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteCourse(id);
            setCourses(prev => prev.filter(c => c.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;

    const filtered = courses
        .filter(c => filter === 'published' ? c.isPublished : filter === 'draft' ? !c.isPublished : true)
        .filter(c => !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()));

    const published = courses.filter(c => c.isPublished).length;
    const drafts = courses.filter(c => !c.isPublished).length;

    return (
        <div className="flex flex-col flex-1 bg-background text-text">
            {/* Header */}
            <div className="border-b border-border bg-card px-4 sm:px-8 py-4 sm:py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-muted font-semibold uppercase tracking-widest mb-2">
                                <Layers className="w-3.5 h-3.5 text-primary" />
                                Admin · Course Management
                            </div>
                            <h1 className="text-2xl font-black text-text">Course Drafts</h1>
                            <p className="text-sm text-muted mt-1">Manage, edit and publish your courses.</p>
                        </div>
                        <button
                            onClick={() => navigate(paths.admin.course_creator)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shrink-0"
                        >
                            <Plus className="w-4 h-4" /> New Course
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {[
                            { icon: <BarChart2 className="w-4 h-4" />, label: 'Total', value: courses.length, color: 'text-primary' },
                            { icon: <Globe className="w-4 h-4" />, label: 'Published', value: published, color: 'text-green-500' },
                            { icon: <Clock className="w-4 h-4" />, label: 'Drafts', value: drafts, color: 'text-amber-500' },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-border bg-background">
                                <span className={s.color}>{s.icon}</span>
                                <div>
                                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">{s.label}</p>
                                    <p className={`text-lg font-black leading-none ${s.color}`}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-border bg-card/50 px-4 sm:px-8 py-3">
                <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background">
                        {(['all', 'published', 'draft'] as Filter[]).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background flex-1 max-w-xs">
                        <Search className="w-3.5 h-3.5 text-muted shrink-0" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search courses…"
                            className="flex-1 text-sm bg-transparent border-none outline-none text-text placeholder:text-muted"
                        />
                    </div>

                    <span className="text-xs text-muted ml-auto">{filtered.length} of {courses.length} courses</span>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-muted">
                            <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-20" />
                            <p className="font-bold text-base mb-1">No courses found</p>
                            <p className="text-sm">
                                {search ? 'Try a different search.' : filter !== 'all' ? `No ${filter} courses yet.` : 'Create your first course.'}
                            </p>
                            {!search && filter === 'all' && (
                                <button onClick={() => navigate(paths.admin.course_creator)}
                                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors mx-auto">
                                    <Plus className="w-4 h-4" /> Create Course
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map((course, i) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    index={i}
                                    onEdit={() => navigate(paths.admin.course_creator_edit(course.id))}
                                    onTogglePublish={() => handleTogglePublish(course)}
                                    onDelete={() => handleDelete(course.id)}
                                    deleting={deletingId === course.id}
                                    toggling={togglingId === course.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
