import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, User } from "lucide-react";
import Card from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { exploreDrawings } from "../_mock/mockPosts";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";

const exploreImages: Record<string, string> = {
  e1: "https://images.unsplash.com/photo-1615717146113-495e481c17c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBkcmF3aW5nJTIwc2tldGNofGVufDF8fHx8MTc3MDY2MTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  e2: "https://images.unsplash.com/photo-1720293315623-24354129a174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGx1c3RyYXRpb24lMjBhcnR3b3JrJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzcwNjYxOTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  e3: "https://images.unsplash.com/photo-1769485016772-c5a4234a6be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmslMjBkcmF3aW5nJTIwcGVuJTIwc2tldGNofGVufDF8fHx8MTc3MDY2MTk2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  e4: "https://images.unsplash.com/photo-1695154207190-64df5b9c1e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBhcnR8ZW58MXx8fHwxNzcwNjYxOTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  e5: "https://images.unsplash.com/photo-1693571109313-701c1929290f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwZHJhd2luZyUyMHRhYmxldHxlbnwxfHx8fDE3NzA2NjE5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  e6: "https://images.unsplash.com/photo-1705831156575-a5294d295a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFuaW1lJTIwc2tldGNofGVufDF8fHx8MTc3MDY2MTk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
};

// Reference images for drawings that show with reference
const referenceImages: Record<string, string> = {
  e1: "https://images.unsplash.com/photo-1693039537350-3bba6975add7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGZhY2UlMjByZWZlcmVuY2V8ZW58MXx8fHwxNzcwNjYxODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  e3: "https://images.unsplash.com/photo-1769167024664-adde2f760b46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZ2VzdHVyZSUyMGRyYXdpbmd8ZW58MXx8fHwxNzcwNjYxODY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  e5: "https://images.unsplash.com/photo-1660368915200-d5bb5193f947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlsbCUyMGxpZmUlMjBvYmplY3RzfGVufDF8fHx8MTc3MDY2MTg2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
};

export function ExplorePage() {
  const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }
    return `${seconds}s`;
  };

  const toggleLike = (drawingId: string) => {
    setLikedDrawings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(drawingId)) {
        newSet.delete(drawingId);
      } else {
        newSet.add(drawingId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2">Explore</h1>
          <p className="text-muted-foreground mb-8">
            Discover amazing artwork from the community
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreDrawings.map((drawing, index) => (
              <motion.div
                key={drawing.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{drawing.username}</span>
                        <span className="text-muted-foreground text-sm">
                          {formatDate(drawing.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image(s) */}
                  {drawing.showWithReference && drawing.referenceUrl ? (
                    <div className="grid grid-cols-2 gap-1 bg-muted">
                      <div className="aspect-square overflow-hidden">
                        <ImageWithFallback
                          src={referenceImages[drawing.id]}
                          alt="Reference"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-square overflow-hidden">
                        <ImageWithFallback
                          src={exploreImages[drawing.id]}
                          alt={`Drawing by ${drawing.username}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted overflow-hidden">
                      <ImageWithFallback
                        src={exploreImages[drawing.id]}
                        alt={`Drawing by ${drawing.username}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Actions and Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <motion.button
                        onClick={() => toggleLike(drawing.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedDrawings.has(drawing.id)
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedDrawings.has(drawing.id) ? "fill-current" : ""
                          }`}
                        />
                        <span>
                          {drawing.likes + (likedDrawings.has(drawing.id) ? 1 : 0)}
                        </span>
                      </motion.button>
                      <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{Math.floor(drawing.likes / 5)}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {drawing.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(drawing.duration)}
                      </span>
                    </div>

                    {drawing.showWithReference && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          📸 With Reference
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More (placeholder) */}
          <div className="mt-12 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Load More
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}