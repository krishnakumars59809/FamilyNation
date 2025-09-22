import React from 'react';
import type { View } from '../types';

interface DashboardProps {
    setView: (view: View) => void;
}

// FIX: Moved icon component definitions before their usage to resolve block-scoped variable errors.
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-8 h-8">{children}</div>
);
const BriefcaseIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></IconWrapper>;
const UserGroupIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const DocumentTextIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></IconWrapper>;
const PresentationChartBarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></IconWrapper>;

const dashboardItems = [
    { view: 'connect', title: 'Connect with a Professional', description: 'Find therapists, counselors, and specialists.', icon: <BriefcaseIcon /> },
    { view: 'groups', title: 'Join a Support Group', description: 'Connect with families facing similar challenges.', icon: <UserGroupIcon /> },
    { view: 'resources', title: 'Explore Resources', description: 'Access articles, studies, and expert advice.', icon: <DocumentTextIcon /> },
    { view: 'webinars', title: 'Attend a Webinar', description: 'Learn from experts in live and recorded sessions.', icon: <PresentationChartBarIcon /> },
];

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    return (
        <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, valued member.</h1>
                <p className="mt-2 text-gray-600">You're in a safe space. We are here to help you find the resources and support you need. Start by exploring the options below or click "We Need Help Now!" for immediate assistance from our AI agent, Hazel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardItems.map(item => (
                    <div 
                        key={item.view} 
                        onClick={() => setView(item.view)}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="bg-brand-light text-brand-dark p-4 rounded-full mb-4">
                            {item.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About FamilyNation</h2>
                <div className="space-y-4 text-gray-600">
                    <p><strong className="text-gray-700">Our Mission:</strong> To empower families with the tools, knowledge, and connections to overcome hardship and build stronger, healthier relationships.</p>
                    <p><strong className="text-gray-700">How We're Different:</strong> We combine AI-driven personalization with a curated network of trusted professionals and peer support communities, ensuring you receive guidance that is both expert-led and empathetic.</p>
                </div>
            </div>
        </div>
    );
}
