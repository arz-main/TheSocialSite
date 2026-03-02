import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Button } from "./BasicButton";
import { Calendar, Heart } from "lucide-react";
import { formatDate, formatDuration } from "../../utils/ProfilePageUtils";
import { ImageWithFallback } from "./ImageWithFallBack";
import type { TabsPageProps } from "../../types/ProfilePageTypes";

const PAGE_SIZE = 6; // items per page

export const TabsPage: React.FC<TabsPageProps> = ({
    badges,
    currentUserDrawings,
    userDrawingImages,
    activeTab: activeTabProp,
    setActiveTab: setActiveTabProp,
    renderUploadButtons
}) => {
    const [activeTab, setActiveTab] = useState(activeTabProp || "badges");
    const [drawingsPage, setDrawingsPage] = useState(1);

    // Use provided setActiveTab if available
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setActiveTabProp?.(tab);
    };
    const paginatedDrawings = currentUserDrawings.slice(
        (drawingsPage - 1) * PAGE_SIZE,
        drawingsPage * PAGE_SIZE
    );
    const totalDrawingsPages = Math.ceil(currentUserDrawings.length / PAGE_SIZE);

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="text-text mb-6">
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="drawings">My Drawings</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            {renderUploadButtons && renderUploadButtons(activeTab)}

            {/* Badges Tab */}
            <TabsContent value="badges">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                            >
                                <Card
                                    className={`p-6 transition-all ${badge.earned ? "hover:shadow-lg" : "opacity-50 grayscale"}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{badge.icon}</div>
                                        <div className="flex-1 text-text">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4>{badge.name}</h4>
                                                {badge.earned && (
                                                    <Badge variant="default" className="text-white text-xs h-5 border border-2">
                                                        Earned
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm mb-2">{badge.description}</p>
                                            {badge.earned && badge.earnedDate && (
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(badge.earnedDate)}
                                                </div>
                                            )}
                                            {!badge.earned && <p className="text-xs">Not yet earned</p>}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </TabsContent>

            {/* My Drawings Tab */}
            <TabsContent value="drawings">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedDrawings.map((drawing, index) => (
                            <motion.div
                                key={drawing.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                            >
                                <Card className="text-text overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-square bg-muted overflow-hidden">
                                        <ImageWithFallback
                                            src={userDrawingImages[drawing.id]}
                                            alt={`Drawing ${drawing.id}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">{drawing.category}</Badge>
                                            <span className="text-sm text-muted-foreground">{formatDuration(drawing.duration)}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {drawing.likes}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(drawing.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination for Drawings */}
                    {currentUserDrawings.length > PAGE_SIZE && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button onClick={() => setDrawingsPage((p) => Math.max(p - 1, 1))} disabled={drawingsPage === 1}>
                                Prev
                            </Button>
                            <span className="px-2 py-1">{drawingsPage}</span>
                            <Button onClick={() => setDrawingsPage((p) => Math.min(p + 1, totalDrawingsPages))} disabled={drawingsPage >= totalDrawingsPages}>
                                Next
                            </Button>
                        </div>
                    )}
                </motion.div>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Card className="p-12 text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="mb-2">No Posts Yet</h3>
                        <p className="text-muted-foreground">Share your progress and thoughts with the community</p>
                    </Card>
                </motion.div>
            </TabsContent>
        </Tabs>
    );
};