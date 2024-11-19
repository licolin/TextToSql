"use client";

import {useState} from "react";

type DropdownProps = {
    options: string[];
};

export default function Dropdown({ options }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="rounded mx-1 px-1 flex items-center gap-1 text-gray-900 font-medium hover:bg-gray-300 hover:text-gray-600 focus:outline-none"
            >
                ChatGPT
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 9l-7.5 7.5L4.5 9"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-1/2 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul className="py-1 text-gray-700">
                        {options.map((option, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    className="block px-2 py-1 hover:bg-gray-100 hover:text-gray-900 text-sm"
                                >
                                    {option}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
