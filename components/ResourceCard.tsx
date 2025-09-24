import React from 'react';
import type { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} filled />
      ))}
      {halfStar && <Star key="half" half />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} />
      ))}
      <span className="ml-2 text-xs text-yellow-500">{rating.toFixed(1)}</span>
    </div>
  );
};

const Star: React.FC<{ filled?: boolean; half?: boolean }> = ({
  filled,
  half,
}) => (
  <svg
    className={`w-4 h-4 ${filled || half ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      d={
        half
          ? 'M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545zM10 12.422V4.02l-1.84 3.72-4.11.597 2.97 2.9- .7 4.09L10 12.422z'
          : 'M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z'
      }
    />
  </svg>
);

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-900">{resource.name}</h4>
          <span className="text-xs bg-brand-light text-brand-dark font-medium py-0.5 px-2 rounded-full">
            {resource.type}
          </span>
        </div>
        <StarRating rating={resource.rating} />
      </div>
      <p className="text-sm text-gray-600 my-2">{resource.description}</p>
      <div className="text-xs text-gray-500 space-y-1">
        {resource.contact.website && (
          <p>
            <strong>Web:</strong>{' '}
            <a
              href={resource.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {resource.contact.website}
            </a>
          </p>
        )}
        {resource.contact.phone && (
          <p>
            <strong>Phone:</strong> {resource.contact.phone}
          </p>
        )}
        {resource.contact.address && (
          <p>
            <strong>Address:</strong> {resource.contact.address}
          </p>
        )}
      </div>
    </div>
  );
};
