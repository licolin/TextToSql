"use client";
// import Image from "next/image";
import React, { useState } from 'react';
import ChatGPTIcon from "@/app/component/icons";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const chatData = [
        { id: 1, type: "assitant", content: "Hello! How can I assist you today?" },
        { id: 2, type: "user", content: "Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?" },
        { id: 3, type: "assitant", content: " Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework..." },
    ];

    return (
        <div className="h-screen flex flex-col m-0 p-0">
            <header className="bg-gray-800 text-white py-2 px-6 flex items-center justify-between">
                <h1 className="text-lg font-bold">Header</h1>
                <button
                    onClick={toggleSidebar}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                </button>
            </header>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <aside className="w-1/6 bg-gray-200 p-4 transition-all duration-300">
                        <nav>
                            <ul>
                                <li className="mb-2">
                                    <a href="#" className="text-blue-500">
                                        Link 1
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-blue-500">
                                        Link 2
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-blue-500">
                                        Link 3
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                )}

                <main
                    className={`flex-1 bg-gray-50 p-6 transition-all duration-300 ${
                        isSidebarOpen ? "ml-0" : "w-full"
                    }`}
                >
                    <div className="max-w-7xl mx-auto flex flex-col space-y-4">
                        {chatData.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start ${
                                    message.type === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {message.type === "assitant" && (
                                    <div className="flex-shrink-0 mr-4 overflow-visible">
                                        <ChatGPTIcon />
                                    </div>
                                )}

                                <div
                                    className={`p-4 rounded-lg ${
                                        message.type === "user"
                                            ? "bg-blue-500 text-white w-4/5"
                                            : "bg-gray-200 text-gray-900 w-full"
                                    }`}
                                >
                                    {message.content}
                                </div>

                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
