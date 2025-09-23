import React from 'react';
import type { View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
  setChatbotOpen: (open: boolean) => void;
}

// Updated icons with more descriptive visuals and FamilyNation brand colors
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-12 h-12">{children}</div>
);

// Alternative more detailed icons option:
const DetailedProfessionalIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#1E3A8A">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    </IconWrapper>
);

const DetailedGroupIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0D9488">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    </IconWrapper>
);

const DetailedResourcesIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#F87171">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    </IconWrapper>
);

const DetailedWebinarIcon = () => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#34D399">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    </IconWrapper>
);

const dashboardItems = [
    { 
        view: 'connect', 
        title: 'Connect with a Professional', 
        description: 'Find vetted therapists, counselors, and specialists tailored to your family\'s needs.', 
        icon: <DetailedProfessionalIcon />,
        color: 'bg-[#1E3A8A]',
        badge: 'Licensed & Verified'
    },
    { 
        view: 'groups', 
        title: 'Join a Support Group', 
        description: 'Connect with families facing similar challenges in safe, moderated spaces.', 
        icon: <DetailedGroupIcon />,
        color: 'bg-[#0D9488]',
        badge: 'Community Support'
    },
    { 
        view: 'resources', 
        title: 'Explore Resources', 
        description: 'Access curated articles, guides, worksheets, and expert advice.', 
        icon: <DetailedResourcesIcon />,
        color: 'bg-[#F87171]',
        badge: 'Expert Curated'
    },
    { 
        view: 'webinars', 
        title: 'Attend a Webinar', 
        description: 'Learn from family experts in live Q&A sessions and recorded workshops.', 
        icon: <DetailedWebinarIcon />,
        color: 'bg-[#34D399]',
        badge: 'Live & Recorded'
    },
];

export const Dashboard: React.FC<DashboardProps> = ({ setView, setChatbotOpen }) => {
    return (
        <div className="animate-fade-in min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
                    <div className="text-center lg:text-left mb-4 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#1E3A8A] font-montserrat bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
                            Welcome to FamilyNation
                        </h1>
                        <p className="text-xl text-[#0D9488] mt-2 font-lato italic">"It Starts at Home."</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#1E3A8A] px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                        🤖 AI Support Available 24/7
                    </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed font-lato text-center lg:text-left max-w-4xl">
                    You're in a safe space. We believe <strong className="text-[#1E3A8A]">stronger families build a stronger future</strong>. 
                    Our AI agent Hazel and curated network of professionals are here to guide you every step of the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                    <button 
                        onClick={() => setChatbotOpen(true)}
                        className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center justify-center"
                    >
                        💬 We Need Help Now! Talk to Hazel
                    </button>
                    <button 
                        onClick={() => setView('about')}
                        className="border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
                    >
                        Learn More About Us
                    </button>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {dashboardItems.map((item, index) => (
                    <div 
                        key={item.view} 
                        onClick={() => setView(item.view)}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Animated background effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        
                        {/* Icon Container */}
                        <div className={`${item.color} p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                            {item.icon}
                        </div>
                        
                        {/* Badge */}
                        <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                            item.view === 'connect' ? 'bg-blue-100 text-blue-800' :
                            item.view === 'groups' ? 'bg-teal-100 text-teal-800' :
                            item.view === 'resources' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {item.badge}
                        </span>
                        
                        {/* Content */}
                        <h3 className="font-bold text-gray-800 text-xl mb-3 font-montserrat group-hover:text-[#1E3A8A] transition-colors duration-300">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-lato flex-grow">
                            {item.description}
                        </p>
                        
                        {/* CTA Arrow */}
                        <div className="mt-6 text-[#1E3A8A] transform group-hover:translate-x-2 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-[#1E3A8A] mb-2">500+</div>
                    <div className="text-gray-600 font-lato">Licensed Professionals</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-[#0D9488] mb-2">10K+</div>
                    <div className="text-gray-600 font-lato">Families Supported</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-[#F87171] mb-2">95%</div>
                    <div className="text-gray-600 font-lato">Satisfaction Rate</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <div className="text-3xl font-bold text-[#34D399] mb-2">24/7</div>
                    <div className="text-gray-600 font-lato">AI Support Available</div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#0D9488] to-[#1E3A8A] p-10 rounded-2xl shadow-xl text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <h2 className="text-4xl font-bold mb-8 font-montserrat text-center relative z-10">Why Choose FamilyNation?</h2>
                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 font-montserrat flex items-center">
                            <span className="w-3 h-3 bg-[#FACC15] rounded-full mr-3"></span>
                            Our Mission
                        </h3>
                        <p className="leading-relaxed font-lato text-lg">
                            To empower families with predictive insights, curated resources, and compassionate support 
                            to overcome hardship and build stronger, healthier relationships that ripple outward into communities.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4 font-montserrat flex items-center">
                            <span className="w-3 h-3 bg-[#34D399] rounded-full mr-3"></span>
                            How We're Different
                        </h3>
                        <ul className="space-y-3 font-lato text-lg">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-[#FACC15] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                <strong>Problem-first focus</strong> - We start with your family's reality
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-[#34D399] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                <strong>Predictive analytics</strong> - Hazel forecasts potential outcomes
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-[#F87171] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                <strong>Curated resources</strong> - All vetted for trust and quality
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-[#FACC15] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                <strong>Whole-family view</strong> - Addressing interconnected struggles
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Call to Action Footer */}
            <div className="mt-12 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4 font-montserrat">Ready to Take the First Step?</h3>
                <p className="text-gray-700 text-lg mb-6 font-lato max-w-2xl mx-auto">
                    <strong>Remember:</strong> Problems in the home don't stay there. Solving them improves outcomes in schools, workplaces, and society.
                </p>
                <button 
                    onClick={() => setChatbotOpen(true)}
                    className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] hover:from-[#0D9488] hover:to-[#1E3A8A] text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                >
                    Start Your Journey with Hazel Today
                </button>
            </div>
        </div>
    );
}