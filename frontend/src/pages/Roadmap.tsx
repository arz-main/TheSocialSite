import React from 'react';
import { motion } from 'motion/react';
import CourseCard from '../components/ui/RoadmapPageComponents';
// 1. Import the mock data
import { MOCK_COURSES } from '../_mock/mockCourses';

export default function Roadmap() {
    return (
        <div className="flex flex-col flex-1 w-full p-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-10 py-5">
                    <h1 className="text-4xl font-bold mb-6">Roadmap</h1>
                    <p className="text-lg mb-10">
                        Our roadmap will guide you through the basics of drawing to more advanced techniques. Each course is designed to
                        build on the previous one, helping you develop your skills step by step. Whether you're a complete beginner or looking to refine your skills, our roadmap has something for everyone.
                    </p>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                        {MOCK_COURSES.map((course) => (
                            <CourseCard
                                key={course.id}
                                image={course.image}
                                title={course.title}
                                description={course.description}
                                progress={course.progress}
                                badgeText={course.badgeText}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}