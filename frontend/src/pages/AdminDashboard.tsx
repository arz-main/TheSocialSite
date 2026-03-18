import { useState, useMemo, useEffect } from "react";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "admin" | "moderator" | "user";
type PostStatus = "published" | "draft" | "flagged";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  joined: string;
  posts: number;
}

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  status: PostStatus;
  imageUrl: string;
  referenceUrl?: string;
  category: string;
  duration: number;
  createdAt: string;
  likes: number;
  comments: number;
  showWithReference: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_ORDER: Role[] = ["user", "moderator", "admin"];

function promoteRole(role: Role): Role {
  const idx = ROLE_ORDER.indexOf(role);
  return idx < ROLE_ORDER.length - 1 ? ROLE_ORDER[idx + 1] : role;
}

const roleBadge: Record<Role, string> = {
  admin:     "bg-amber-400/10 text-amber-400 border border-amber-400/25",
  moderator: "bg-sky-400/10 text-sky-400 border border-sky-400/25",
  user:      "bg-slate-400/10 text-slate-400 border border-slate-400/25",
};

const statusBadge: Record<PostStatus, string> = {
  published: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25",
  draft:     "bg-slate-400/10 text-slate-400 border border-slate-400/25",
  flagged:   "bg-red-400/10 text-red-400 border border-red-400/25",
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-52 transition-all focus:w-64"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 text-slate-500 hover:text-slate-300 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-800">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-3.5 rounded bg-slate-800 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ErrorRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-red-400 text-sm">
        {message}
      </td>
    </tr>
  );
}

// ─── Users Table ──────────────────────────────────────────────────────────────

function UsersTable() {
  const [users, setUsers]           = useState<User[]>([]);
  const [loadingUsers, setLoading]  = useState(false);
  const [errorUsers, setError]      = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [confirm, setConfirm]       = useState<{ type: "delete" | "promote"; id: number } | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User[]>("/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const executeConfirm = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === "delete") {
        await axios.delete(`/users/${confirm.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== confirm.id));
      } else {
        const target = users.find((u) => u.id === confirm.id);
        if (!target) return;
        const newRole = promoteRole(target.role);
        await axios.patch<User>(`/users/${confirm.id}`, { role: newRole });
        setUsers((prev) =>
          prev.map((u) => (u.id === confirm.id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirm(null);
    }
  };

  const targetUser = confirm ? users.find((u) => u.id === confirm.id) : null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {confirm && targetUser && (
        <ConfirmModal
          message={
            confirm.type === "delete"
              ? `Delete user "${targetUser.name}"? This cannot be undone.`
              : `Promote "${targetUser.name}" from ${targetUser.role} to ${promoteRole(targetUser.role)}?`
          }
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-slate-100">Users</h2>
          {!loadingUsers && (
            <span className="text-xs font-mono bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5 text-slate-500">
              {filtered.length}
            </span>
          )}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50">
              {["#", "Name", "Email", "Role", "Joined", "Posts", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap border-b border-slate-800"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <TableSkeleton cols={7} />
            ) : errorUsers ? (
              <ErrorRow cols={7} message={errorUsers} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-600 text-sm">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${roleBadge[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{user.joined}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{user.posts}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirm({ type: "promote", id: user.id })}
                        disabled={user.role === "admin"}
                        title={user.role === "admin" ? "Already top role" : `Promote to ${promoteRole(user.role)}`}
                        className="px-2.5 py-1 text-xs rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ↑ Promote
                      </button>
                      <button
                        onClick={() => setConfirm({ type: "delete", id: user.id })}
                        className="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Posts Table ──────────────────────────────────────────────────────────────

function PostsTable() {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loadingPosts, setLoading]  = useState(false);
  const [errorPosts, setError]      = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [confirm, setConfirm]       = useState<string | null>(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Post[]>("/posts");
        setPosts(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.author.toLowerCase().includes(search.toLowerCase()) ||
          p.status.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [posts, search]
  );

  const handleDeleteConfirm = async () => {
    if (confirm === null) return;
    try {
      await axios.delete(`/posts/${confirm}`);
      setPosts((prev) => prev.filter((p) => p.id !== confirm));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirm(null);
    }
  };

  const targetPost = confirm !== null ? posts.find((p) => p.id === confirm) : null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {confirm !== null && targetPost && (
        <ConfirmModal
          message={`Delete post "${targetPost.title}"? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-slate-100">Posts</h2>
          {!loadingPosts && (
            <span className="text-xs font-mono bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5 text-slate-500">
              {filtered.length}
            </span>
          )}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search posts…" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50">
              {["#", "Title", "Author", "Category", "Status", "Likes", "Comments", "Created At", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap border-b border-slate-800"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingPosts ? (
              <TableSkeleton cols={9} />
            ) : errorPosts ? (
              <ErrorRow cols={9} message={errorPosts} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-600 text-sm">
                  No posts match your search.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{post.id}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} className="w-8 h-8 rounded object-cover shrink-0 bg-slate-800" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-slate-200 truncate">{post.title}</div>
                        {post.description && (
                          <div className="text-xs text-slate-500 truncate max-w-[180px]">{post.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.author}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${statusBadge[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{post.likes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{post.comments.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{post.createdAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setConfirm(post.id)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

interface StatCardsProps {
  userCount: number;
  postCount: number;
  publishedCount: number;
  flaggedCount: number;
}

function StatCards({ userCount, postCount, publishedCount, flaggedCount }: StatCardsProps) {
  const stats = [
    { label: "Total Users",  value: userCount,      icon: "👤", color: "text-sky-400"     },
    { label: "Total Posts",  value: postCount,       icon: "📝", color: "text-violet-400"  },
    { label: "Published",    value: publishedCount,  icon: "✅", color: "text-emerald-400" },
    { label: "Flagged",      value: flaggedCount,    icon: "🚩", color: "text-red-400"     },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
        >
          <span className="text-2xl">{s.icon}</span>
          <div>
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [users, setUsers]           = useState<User[]>([]);
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loadingUsers, setLoadingU] = useState(false);
  const [loadingPosts, setLoadingP] = useState(false);

  // Fetch users for stat cards
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingU(true);
        const response = await axios.get<User[]>("/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingU(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch posts for stat cards
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingP(true);
        const response = await axios.get<Post[]>("/posts");
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingP(false);
      }
    };
    fetchPosts();
  }, []);

  const isLoading = loadingUsers || loadingPosts;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center text-xs font-bold text-slate-900">
            A
          </div>
          <span className="text-sm font-semibold tracking-tight">AdminPanel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
          <span className="text-xs font-mono text-slate-500">
            {isLoading ? "Loading…" : "Live"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your users and content.</p>
        </div>

        <StatCards
          userCount={users.length}
          postCount={posts.length}
          publishedCount={posts.filter((p) => p.status === "published").length}
          flaggedCount={posts.filter((p) => p.status === "flagged").length}
        />

        <UsersTable />
        <PostsTable />
      </main>
    </div>
  );
}