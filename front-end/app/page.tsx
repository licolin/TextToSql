"use client";
import React, {useEffect, useRef, useState} from 'react';
import ChatGPTIcon from "@/app/component/icons";
import {MdOutlineAddBox} from "react-icons/md";
import {MdListAlt} from "react-icons/md";
import Dropdown from '@/app/component/Dropdown';
import {BsArrowUpCircle} from "react-icons/bs";
import {dropdownOptions_for_models} from "@/app/component/configs";
import {v4 as uuidv4} from 'uuid';

import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
    id: string;
    type: string;
    content: string;
    title: string;
}

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [selectedOption, setSelectedOption] = useState<string>(dropdownOptions_for_models[0]);
    const [currentTitle, setCurrentTitle] = useState("");
    const [titleList, setTitleList] = useState([]);
    const [chatData, setChatData] = useState(() => {
        const storedChatData = localStorage.getItem("chatData");
        const ret: Message[] = storedChatData ? JSON.parse(storedChatData) : []
        if (ret.length) {
            const titles = [...new Set(ret.map(item => item.title))];
            setCurrentTitle(titles[0]);
            setTitleList(titles);
        }
        return ret;
    });

    useEffect(() => {
        localStorage.setItem("chatData", JSON.stringify(chatData));
    }, [chatData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage().then(() => console.log("send message!"));
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: uuidv4(),
            type: "user",
            content: input.trim(),
            title: "",
        };

        setChatData((prev) => [...prev, userMessage]);
        setInput("");
        if (!currentTitle) {
            setCurrentTitle(input.trim());
            setTitleList((prev)=>[...prev,input.trim()])
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: input.trim(), // User input question
                    model: selectedOption,              // Model name
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch the response from LLM.");
            }

            const data = await response.json();
            const assistantMessage = {
                id: uuidv4(),
                type: "assistant",
                content: data.reply || "No response received",
                title: currentTitle,
            };

            console.log("info " + JSON.stringify(data.reply));

            setChatData((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                id: uuidv4(),
                type: "assistant",
                content: "Error fetching response from the server.",
                title: currentTitle,
            };
            setChatData((prev) => [...prev, errorMessage]);
        }
    };
    console.log("chatData " + JSON.stringify(chatData));
    // const isMultiLine = input.split('\n').length > 1;

    return (
        <div className="h-screen flex flex-col m-0 p-0">
            <div className="flex h-full">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <aside className="w-1/6 p-2 h-screen flex-shrink-0 transition-all duration-300">
                        <div className="flex justify-between">
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"
                                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}><MdListAlt size={20}/></div>
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"><MdOutlineAddBox size={20}/></div>
                        </div>
                        <nav>
                            {titleList.length && (
                                <div className="mt-2">
                                    {titleList.map((title, index) => (
                                        <div key={index} className="mx-2 my-[2px] px-2 py-[2px] cursor-pointer bg-blue-200 hover:bg-blue-500 rounded-md">{title}</div>
                                    ))}
                                </div>
                            )}
                        </nav>
                    </aside>
                )}

                <main
                    className={`flex-1 bg-gray-50 transition-all overflow-y-auto duration-300 mr-3 pb-[100px] ${
                        isSidebarOpen ? "ml-0" : "w-full"
                    }`}
                >
                    {isSidebarOpen &&
                        <div className={`relative inline-block text-left ${isSidebarOpen ? "ml-4 pt-2" : ""}`}>
                            <Dropdown
                                options={dropdownOptions_for_models}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                            />
                        </div>}

                    {!isSidebarOpen && (
                        <div className="flex justify-between w-20 p-2">
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"
                                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}><MdListAlt size={20}/></div>
                            <div className="hover:bg-gray-300 p-[2px] m-0 rounded-md"><MdOutlineAddBox size={20}/></div>
                            <div><Dropdown
                                options={dropdownOptions_for_models}
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
                                {message.type === "assistant" && (
                                    <div className="flex-shrink-0 mx-3 overflow-visible">
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
                                    {/*{message.content}*/}
                                    <ReactMarkdown
                                        components={{
                                            code({inline, className, children, ...props}) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={oneDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>

                                </div>

                            </div>
                        ))}
                        <div className="fixed bottom-0 w-4/5 pb-4 border-0">
                            <div className="fixed bottom-0 w-4/5 left-1/8 pb-4 border-0">
                                <div className="relative items-center max-w-4xl mx-auto ">  {/* 添加相对定位容器 */}
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full  py-4 mr-10 pl-5 max-h-40  overflow-auto shadow-lg outline-blue-500 resize-none rounded-3xl rounded-br-lg`}
                                        placeholder="输入提示词 ..."
                                        onKeyDown={handleKeyDown}
                                    />
                                    <BsArrowUpCircle
                                        onClick={sendMessage}
                                        className={`absolute right-[6px] bottom-0 transform -translate-y-1/2 cursor-pointer ${
                                            input.trim() ? 'text-gray-700 hover:text-gray-800' : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        size={22}
                                    />
                                </div>


                            </div>
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
}
