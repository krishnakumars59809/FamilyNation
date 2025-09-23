import React from 'react';
import type { View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
  setChatbotOpen: (open: boolean) => void;
}

// Updated icons with FamilyNation brand colors
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10">{children}</div>
);

const BriefcaseIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#1E3A8A">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </IconWrapper>
);

const UserGroupIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0D9488">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    </IconWrapper>
);

const DocumentTextIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#F87171">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    </IconWrapper>
);

const PresentationChartBarIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#34D399">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
    </IconWrapper>
);

const dashboardItems = [
    { 
        view: 'connect', 
        title: 'Connect with a Professional', 
        description: 'Find vetted therapists, counselors, and specialists.', 
        icon: <BriefcaseIcon />,
        color: 'bg-[#1E3A8A]'
    },
    { 
        view: 'groups', 
        title: 'Join a Support Group', 
        description: 'Connect with families facing similar challenges.', 
        icon: <UserGroupIcon />,
        color: 'bg-[#0D9488]'
    },
    { 
        view: 'resources', 
        title: 'Explore Resources', 
        description: 'Access curated articles, studies, and expert advice.', 
        icon: <DocumentTextIcon />,
        color: 'bg-[#F87171]'
    },
    { 
        view: 'webinars', 
        title: 'Attend a Webinar', 
        description: 'Learn from experts in live and recorded sessions.', 
        icon: <PresentationChartBarIcon />,
        color: 'bg-[#34D399]'
    },
];

export const Dashboard: React.FC<DashboardProps> = ({ setView ,setChatbotOpen}) => {
    return (
        <div className="animate-fade-in min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1E3A8A] font-montserrat">Welcome to FamilyNation</h1>
                        <p className="text-lg text-[#0D9488] mt-2 font-lato">"It Starts at Home."</p>
                    </div>
                    <div className="bg-[#FACC15] text-[#1E3A8A] px-4 py-2 rounded-full font-bold text-sm">
                        AI Support Available
                    </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed font-lato">
                    You're in a safe space. We believe <strong>stronger families build a stronger future</strong>. 
                    Our AI agent Hazel and curated network of professionals are here to guide you every step of the way.
                </p>
                <button 
                    onClick={() => setChatbotOpen('chat')}
                    className="mt-6 bg-[#F87171] hover:bg-[#e56565] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    💬 We Need Help Now! Talk to Hazel
                </button>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardItems.map(item => (
                    <div 
                        key={item.view} 
                        onClick={() => setView(item.view)}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                    >
                        <div className={`${item.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 font-montserrat">{item.title}</h3>
                        <p className="text-gray-600 text-sm font-lato">{item.description}</p>
                        <div className="mt-4 text-xs text-gray-400 font-lato">
                            Professionally curated • Family-focused • Trusted
                        </div>
                    </div>
                ))}
            </div>

            {/* About Section */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] p-8 rounded-xl shadow-lg text-white">
                <h2 className="text-3xl font-bold mb-6 font-montserrat">About FamilyNation</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-3 font-montserrat">Our Mission</h3>
                        <p className="leading-relaxed font-lato">
                            To empower families with predictive insights, curated resources, and compassionate support 
                            to overcome hardship and build stronger, healthier relationships that ripple outward into communities.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3 font-montserrat">How We're Different</h3>
                        <ul className="space-y-2 font-lato">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#FACC15] rounded-full mr-3"></span>
                                <strong>Problem-first focus</strong> - We start with your family's reality
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#34D399] rounded-full mr-3"></span>
                                <strong>Predictive analytics</strong> - Hazel forecasts potential outcomes
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#F87171] rounded-full mr-3"></span>
                                <strong>Curated resources</strong> - All vetted for trust and quality
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#FACC15] rounded-full mr-3"></span>
                                <strong>Whole-family view</strong> - Addressing interconnected struggles
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Call to Action Footer */}
            <div className="mt-8 text-center">
                <p className="text-gray-600 font-lato">
                    <strong>Remember:</strong> Problems in the home don't stay there. Solving them improves outcomes in schools, workplaces, and society.
                </p>
            </div>
        </div>
    );
}