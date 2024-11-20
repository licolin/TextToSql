"use client";
// import Image from "next/image";
import React, {useRef, useState} from 'react';
import ChatGPTIcon from "@/app/component/icons";
import {MdOutlineAddBox} from "react-icons/md";
import {MdListAlt} from "react-icons/md";
import Dropdown from '@/app/component/Dropdown';

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedOption, setSelectedOption] = useState<string>("ChatGPT");


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // sendMessage();
        }
    };

    const chatData = [
        {id: 1, type: "assitant", content: "Hello! How can I assist you today?"},
        {
            id: 2,
            type: "user",
            content: "Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?Can you explain how Next.js works?"
        },
        {
            id: 3,
            type: "assitant",
            content: " Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework...Sure! Next.js is a React framework..."
        },
    ];

    return (
        <div className="h-screen flex flex-col m-0 p-0">
            <div className="flex flex-1">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <aside className="w-1/6 p-2 transition-all duration-300">
                        <div className="flex justify-between">
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"
                                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}><MdListAlt size={20}/></div>
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"><MdOutlineAddBox size={20}/></div>
                        </div>
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
                    className={`flex-1 bg-gray-50 transition-all duration-300 ${
                        isSidebarOpen ? "ml-0" : "w-full"
                    }`}
                >
                    {isSidebarOpen &&
                        <div className={`relative inline-block text-left ${isSidebarOpen ? "ml-4 pt-2" : ""}`}>
                            <Dropdown
                                options={['OptionA', 'OptionB', 'OptionC']}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                            />
                        </div>}

                    {!isSidebarOpen && (
                        <div className="flex justify-between w-20 p-2">
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"
                                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}><MdListAlt size={20}/></div>
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"><MdOutlineAddBox size={20}/></div>
                            <div> <Dropdown
                                options={['OptionA', 'OptionB', 'OptionC']}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                            /></div>
                        </div>
                    )
                    }
                    <div className={`max-w-7xl mx-auto flex flex-col space-y-4 ${isSidebarOpen ? "mt-10" : ""}`}>
                        {chatData.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start ${
                                    message.type === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {message.type === "assitant" && (
                                    <div className="flex-shrink-0 mr-4 overflow-visible">
                                        <ChatGPTIcon/>
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
                        <div className="fixed bottom-0 w-4/5 pb-4 border-0">
                            <div className="flex items-center max-w-4xl mx-auto w-full">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full py-2 px-2 border-none outline-none overflow-hidden shadow-lg rounded-full"
                                    placeholder="输入提示词 ..."
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    // onClick={sendMessage}
                                    disabled={!input.trim()}
                                    className={`ml-2 p-1 w-10 rounded text-sm ${input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    发送
                                </button>
                            </div>
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
}
