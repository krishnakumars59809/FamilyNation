import React from 'react';
import type { View } from '../types';

interface PlaceholderViewProps {
  view: View;
}

const viewDetails: Record<View, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Main overview.' },
  groups: {
    title: 'Groups',
    description: 'Find and join peer support groups.',
  },
  discussions: {
    title: 'Discussions',
    description: 'Participate in community conversations.',
  },
  community: {
    title: 'The FamilyNation Community',
    description: 'Connect with other members.',
  },
  connect: {
    title: 'Connect With A Professional',
    description: 'Browse and contact verified professionals.',
  },
  podcasts: {
    title: 'Podcasts',
    description: 'Listen to expert interviews and stories.',
  },
  webinars: {
    title: 'Webinars',
    description: 'Watch live and recorded educational sessions.',
  },
  resources: {
    title: 'Research Resources',
    description: 'Access a library of articles, studies, and tools.',
  },
  events: {
    title: 'Events',
    description: 'View upcoming workshops and community events.',
  },
};

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ view }) => {
  const details = viewDetails[view] || {
    title: 'Page',
    description: 'Content will be here.',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white p-8 rounded-lg shadow-sm border animate-fade-in">
      <div className="bg-brand-light p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-brand-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.572 10.572a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L.928 11.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 capitalize">
        {details.title}
      </h1>
      <p className="mt-2 text-lg text-gray-600">{details.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        This feature is currently under construction. Please check back soon!
      </p>
    </div>
  );
};
