import React from 'react';

export default function Roadmap() {
    return (
        <div className="flex flex-col flex-1 w-full p-6 bg-background text-text">
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Roadmap</h1>
            <p className="text-lg mb-4">
                Our roadmap outlines the future development plans for our platform. We are committed to continuously improving and adding new features to enhance the user experience for artists and art enthusiasts alike.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Q3 2024</h2>
            <ul className="list-disc list-inside mb-6">
                <li>Launch of the mobile app for iOS and Android.</li>
                <li>Integration of AI-powered art critique and feedback system.</li>
                <li>Introduction of a new "Challenges" feature to encourage artistic growth.</li>
            </ul>
            </div>
        </div>
    );
}
