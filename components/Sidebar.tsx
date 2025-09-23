import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from '../assets/images/logo.png';
// Keep your icon definitions and navItems the same
// just add a "path" field for routes
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-6 h-6">{children}</div>
);
const HomeIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></IconWrapper>;
const UserGroupIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const ChatAlt2Icon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg></IconWrapper>;
const GlobeIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.586-.586a2 2 0 012.828 0l2 2a2 2 0 010 2.828l-2 2a2 2 0 01-2.828 0l-.586-.586a2 2 0 00-2.828 0L7.707 10.5m0-6.207l-2 2a2 2 0 000 2.828l2 2a2 2 0 002.828 0l.586-.586a2 2 0 012.828 0l2 2a2 2 0 010 2.828l-2 2a2 2 0 01-2.828 0l-.586-.586a2 2 0 00-2.828 0" /></svg></IconWrapper>;
const BriefcaseIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></IconWrapper>;
const MicrophoneIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg></IconWrapper>;
const PresentationChartBarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></IconWrapper>;
const DocumentTextIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></IconWrapper>;
const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
  { id: "groups", label: "Groups", icon: <UserGroupIcon />, path: "/groups" },
  { id: "discussions", label: "Discussions", icon: <ChatAlt2Icon />, path: "/discussions" },
  { id: "community", label: "Community", icon: <GlobeIcon />, path: "/community" },
  { id: "connect", label: "Connect With A Professional", icon: <BriefcaseIcon />, path: "/connect" },
  { id: "podcasts", label: "Podcasts", icon: <MicrophoneIcon />, path: "/podcasts" },
  { id: "webinars", label: "Webinars", icon: <PresentationChartBarIcon />, path: "/webinars" },
  { id: "resources", label: "Research Resources", icon: <DocumentTextIcon />, path: "/resources" },
  { id: "events", label: "Events", icon: <CalendarIcon />, path: "/events" },
] as const;

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0D9488] text-white flex-shrink-0 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
        <div className="text-center flex items-center justify-center">
          <Link to="/dashboard">
          <div className="text-2xl font-bold font-montserrat pl-7">
<img src ={logo} width={50} height={50} className="bg-white "/>
          </div>
          <div className="text-xs text-white/80 font-lato mt-1 font-bold">"It Starts at Home."</div>
          </Link>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive ? "bg-brand-accent text-brand-dark" : "text-gray-300 hover:bg-brand hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
