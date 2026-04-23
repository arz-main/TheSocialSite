import type { AdminPostsTableProps, PostConfirm } from "../../types/AdminPageTypes";
import { SectionHeader } from "./shared/SectionHeader";
import { ConfirmModal } from "./shared/ConfirmModal";
import { DataTable } from "./shared/DataTable";
import { ErrorRow } from "./shared/ErrorRow";
import { TableSkeleton } from "./shared/TableSkeleton";
import type { Post, PostStatus } from "../../types/PostTypes";
import { useState, useEffect } from "react";
import { usePosts } from "../../hooks/usePosts";
import { useFilteredData } from "../../utils/AdminDashboardPageUtil";

const statusBadge: Record<PostStatus, string> = {
    Published: "bg-success/10 text-success border border-success/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    Draft: "bg-muted/10 text-muted border border-muted/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    Flagged: "bg-danger/10 text-danger border border-danger/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

export function PostsSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postSearch, setPostSearch] = useState("");
    const [postConfirm, setPostConfirm] = useState<PostConfirm>(null);

    const { getAllPosts, deletePost, loading, error } = usePosts();

    useEffect(() => {
        const fetch = async () => {
            const data = await getAllPosts();
            setPosts(data || []);
        };
        fetch();
    }, [getAllPosts]);

    const handleDeletePost = async () => {
        if (!postConfirm) return;
        await deletePost(postConfirm.id);
        setPosts(prev => prev.filter(p => p.id !== postConfirm.id));
        setPostConfirm(null);
    };

    const handlePostOption = async () => {
        if (!postConfirm) return;
        if (postConfirm.type === "delete") await handleDeletePost();
    };

    const filteredPosts = useFilteredData(posts, postSearch, ["title", "authorUsername", "status", "category"]);
    const targetPost = postConfirm ? (posts.find(p => p.id === postConfirm.id) ?? null) : null;

    return (
        <PostsTable
            filteredData={filteredPosts}
            loading={loading}
            error={error}
            search={postSearch}
            onSearch={setPostSearch}
            confirm={postConfirm}
            setConfirm={setPostConfirm}
            executeConfirm={handlePostOption}
            targetPost={targetPost}
        />
    );
}

function PostsTable({
    filteredData,
    loading,
    error,
    search,
    onSearch,
    confirm,
    setConfirm,
    executeConfirm,
    targetPost,
}: AdminPostsTableProps) {
    return (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
            {confirm && targetPost && (
                <ConfirmModal
                    message={`Delete "${targetPost.title}"?`}
                    onConfirm={executeConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
            <SectionHeader
                title="Posts"
                count={filteredData.length}
                search={search}
                onSearch={onSearch}
                placeholder="Search posts…"
            />
            <DataTable headers={["Title", "Author", "Status", "Actions"]}>
                {loading ? (
                    <TableSkeleton cols={4} />
                ) : error ? (
                    <ErrorRow cols={4} message={error} />
                ) : filteredData.map((post) => (
                    <tr
                        key={post.id}
                        className="border-b border-border last:border-0 hover:bg-border/30 transition-colors"
                    >
                        <td className="px-5 py-3.5 text-sm font-medium text-text max-w-65 truncate">
                            {post.title}
                        </td>
                        <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                {post.authorAvatarUrl ? (
                                    <img
                                        src={post.authorAvatarUrl}
                                        alt={post.authorUsername}
                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-accent-soft text-accent flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {post.authorUsername[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm text-muted">{post.authorUsername}</span>
                            </div>
                        </td>
                        <td className="px-5 py-3.5">
                            <span className={statusBadge[post.status]}>{post.status}</span>
                        </td>
                        <td className="px-5 py-3.5">
                            <button
                                onClick={() => setConfirm({ type: "delete", id: post.id })}
                                className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </section>
    );
}