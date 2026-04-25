import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlignLeft, Type, Tag, Send, Loader2, Upload, Link, BookImage, Plus, ExternalLink } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import type { PostDto } from '../types/PostTypes';

const CATEGORIES = ['Drawing', 'Sketch', 'Digital', 'Traditional', 'Study', 'Character', 'Landscape', 'Other'];
type ImageTab = 'upload' | 'link' | 'sketches';

interface Props {
    onClose: () => void;
    onCreated: (post: PostDto) => void;
    userPosts?: PostDto[];
}

export function CreatePostModal({ onClose, onCreated, userPosts = [] }: Props) {
    const { createPost } = usePosts();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageTab, setImageTab] = useState<ImageTab>('link');
    const [imageUrl, setImageUrl] = useState('');
    const [linkInput, setLinkInput] = useState('');
    const [imageError, setImageError] = useState(false);

    const [showReference, setShowReference] = useState(false);
    const [referenceUrl, setReferenceUrl] = useState('');
    const [referenceError, setReferenceError] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Drawing');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = title.trim() && imageUrl.trim() && !submitting;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return; }
        const reader = new FileReader();
        reader.onload = () => { setImageUrl(reader.result as string); setImageError(false); setError(null); };
        reader.readAsDataURL(file);
    };

    const handleLinkLoad = () => {
        setImageUrl(linkInput.trim());
        setImageError(false);
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        setError(null);
        try {
            const post = await createPost({ title: title.trim(), description: description.trim() || undefined, imageUrl, category });
            onCreated(post);
            onClose();
        } catch {
            setError('Failed to create post. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.22 }}
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2 className="text-base font-black text-text">New Post</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-muted/20 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body — two panels */}
                <div className="flex flex-col md:flex-row overflow-auto flex-1 min-h-0">

                    {/* LEFT — Image */}
                    <div className="md:w-[44%] border-b md:border-b-0 md:border-r border-border flex flex-col min-h-0">
                        {/* Tabs */}
                        <div className="flex border-b border-border shrink-0">
                            {([
                                { id: 'upload' as const, icon: <Upload className="w-3.5 h-3.5" />, label: 'Upload' },
                                { id: 'link' as const, icon: <Link className="w-3.5 h-3.5" />, label: 'Link' },
                                { id: 'sketches' as const, icon: <BookImage className="w-3.5 h-3.5" />, label: 'My Sketches' },
                            ]).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setImageTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-px
                                        ${imageTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col flex-1 p-4 gap-3 overflow-y-auto">
                            {imageTab === 'upload' && (
                                <>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    {!imageUrl || imageError ? (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer min-h-[180px]"
                                        >
                                            <Upload className="w-8 h-8 text-muted" />
                                            <span className="text-sm text-muted">Click to upload</span>
                                            <span className="text-xs text-muted/60">Max 5 MB</span>
                                        </button>
                                    ) : (
                                        <div className="relative min-h-[180px]">
                                            <img src={imageUrl} alt="preview" className="w-full max-h-[240px] object-cover rounded-xl border border-border" />
                                            <button onClick={() => { setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {imageTab === 'link' && (
                                <>
                                    <div className="flex gap-2 shrink-0">
                                        <input
                                            value={linkInput}
                                            onChange={e => { setLinkInput(e.target.value); setImageError(false); }}
                                            onKeyDown={e => e.key === 'Enter' && handleLinkLoad()}
                                            placeholder="https://i.imgur.com/..."
                                            className="flex-1 border border-border rounded-xl px-3 py-2 text-xs bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                        />
                                        <button onClick={handleLinkLoad}
                                            className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shrink-0">
                                            Load
                                        </button>
                                    </div>
                                    {imageUrl && !imageError ? (
                                        <div className="relative">
                                            <img src={imageUrl} alt="preview"
                                                className="w-full max-h-[240px] object-cover rounded-xl border border-border"
                                                onError={() => setImageError(true)} />
                                            <button onClick={() => { setImageUrl(''); setLinkInput(''); }}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border min-h-[180px]">
                                            {imageError
                                                ? <span className="text-xs text-danger">Could not load image.</span>
                                                : <span className="text-xs text-muted">Preview appears here</span>}
                                        </div>
                                    )}
                                </>
                            )}

                            {imageTab === 'sketches' && (
                                userPosts.length === 0 ? (
                                    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border min-h-[180px]">
                                        <span className="text-xs text-muted">No previous sketches</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {userPosts.map(post => (
                                            <button key={post.id} onClick={() => { setImageUrl(post.imageUrl); setImageError(false); }}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                                    ${imageUrl === post.imageUrl ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )
                            )}

                            {/* Reference */}
                            <div className="shrink-0 mt-auto pt-2">
                                {!showReference ? (
                                    <button onClick={() => setShowReference(true)}
                                        className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
                                        <Plus className="w-3.5 h-3.5" /> Add Reference
                                    </button>
                                ) : (
                                    <div className="space-y-2 border border-border rounded-xl p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Reference Image</span>
                                            <button onClick={() => { setShowReference(false); setReferenceUrl(''); setReferenceError(false); }}
                                                className="text-muted hover:text-text">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input value={referenceUrl}
                                                onChange={e => { setReferenceUrl(e.target.value); setReferenceError(false); }}
                                                placeholder="https://..."
                                                className="flex-1 border border-border rounded-lg px-3 py-1.5 text-xs bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary" />
                                            {referenceUrl && (
                                                <a href={referenceUrl} target="_blank" rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg border border-border text-muted hover:text-text transition-colors">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {referenceUrl && !referenceError && (
                                                <motion.img
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    src={referenceUrl} alt="reference"
                                                    className="w-full max-h-24 object-cover rounded-lg border border-border"
                                                    onError={() => setReferenceError(true)} />
                                            )}
                                        </AnimatePresence>
                                        {referenceError && <p className="text-xs text-danger">Could not load reference.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Form */}
                    <div className="flex-1 flex flex-col px-6 py-5 gap-4 overflow-y-auto">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted mb-1.5">
                                <Type className="w-3 h-3" /> Title <span className="text-danger">*</span>
                            </label>
                            <input value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Character study — hands"
                                maxLength={100}
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors" />
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted mb-1.5">
                                <AlignLeft className="w-3 h-3" /> Description
                                <span className="text-muted/50 font-normal normal-case tracking-normal ml-1">optional</span>
                            </label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)}
                                placeholder="What did you work on? Notes, tools, techniques..."
                                rows={4} maxLength={500}
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none" />
                            <p className="text-[10px] text-muted/60 text-right mt-0.5">{description.length}/500</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted mb-1.5">
                                <Tag className="w-3 h-3" /> Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setCategory(cat)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all
                                            ${category === cat ? 'bg-primary border-primary text-white' : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-xs text-danger bg-danger/10 px-3 py-2 rounded-lg">{error}</p>}

                        <div className="mt-auto flex items-center justify-end gap-3 pt-2 border-t border-border">
                            <button onClick={onClose}
                                className="px-4 py-2 rounded-xl text-sm text-muted hover:text-text border border-border hover:bg-muted/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={!canSubmit}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {submitting ? 'Posting…' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
