"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addBookmark, removeBookmark } from "@/lib/actions/companion.actions";

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked: initialBookmarked,
}: Companion) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        await removeBookmark(id, window.location.pathname);
        setIsBookmarked(false);
      } else {
        await addBookmark(id, window.location.pathname);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      // You could add a toast notification here
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <Link href={`/companions/${id}`} className="block h-full">
      <article 
        className="companion-card group relative overflow-hidden h-full flex flex-col cursor-pointer transform transition-all duration-150 hover:scale-105 hover:shadow-xl"
        style={{ backgroundColor: color }}
      >
        {/* Header with subject and bookmark */}
        <div className="flex justify-between items-center">
          <div className="subject-badge text-xs lg:text-sm transform transition-transform duration-150 group-hover:scale-105">
            {subject}
          </div>
          <button 
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`
              companion-bookmark transition-all duration-150 group-hover:scale-110
              ${isBookmarking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isBookmarked 
                ? 'bg-primary hover:bg-primary-hover' 
                : 'bg-black hover:bg-primary'
              }
            `}
          >
            <Image
              src={isBookmarked ? "/icons/bookmark-filled.png" : "/icons/bookmarks.png"}
              alt="bookmark"
              width={12.5}
              height={15}
              className="filter brightness-0 invert"
            />
          </button>
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center mb-4 pt-2">
          <h2 className="text-xl lg:text-2xl font-bold mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors duration-150">
            {name}
          </h2>
          <p className="text-sm lg:text-base text-gray-700 line-clamp-3 mb-4 group-hover:text-gray-800 transition-colors duration-150">
            {topic}
          </p>
        </div>

        {/* Duration section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-spin-slow">
            <Image
              src="/icons/chronometer.png"
              alt="duration"
              width={13.5}
              height={13.5}
            />
          </div>
          <p className="text-sm lg:text-base">{duration} minutes</p>
        </div>

        {/* Launch Lesson button */}
        <button className="btn-primary w-full justify-center group-hover:scale-105 transition-transform duration-150 text-sm lg:text-base py-3">
          Launch Lesson
        </button>
      </article>
    </Link>
  );
};

export default CompanionCard;