"use client";

import { Phone, Github } from "lucide-react";

type Tab = { id: string; label: string; icon?: string };

export default function Header({
  activeTab,
  onChange,
  tabs = [],
}: {
  activeTab?: string;
  onChange?: (id: string) => void;
  tabs?: Tab[];
}) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  OpenMic AI Agent
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {tabs.length > 0 && (
              <nav className="hidden md:flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onChange && onChange(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            )}
            <a
              href="https://github.com/Raunakkkkk/Assignment-Raunak"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
