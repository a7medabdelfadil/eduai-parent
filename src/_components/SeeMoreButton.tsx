"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface SeeMoreButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

const SeeMoreButton = ({
  onClick,
  className,
  label = "See More",
}: SeeMoreButtonProps) => {
  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onClick}
        className={cn(
          "text-md flex items-center gap-4 rounded-xl bg-white/90 px-8 py-3 font-medium text-primary backdrop-blur-sm transition-all duration-300 ease-in-out dark:bg-[#0d0d0d]/90",
          "shadow-[0px_16px_32px_rgba(171,190,209,0.3)] dark:shadow-[0px_16px_32px_rgba(93,188,252,0.3)]",
          "hover:bg-white hover:shadow-[0px_18px_36px_rgba(171,190,209,0.4)]",
          "dark:hover:bg-[#111111] dark:hover:shadow-[0px_18px_36px_rgba(93,188,252,0.4)]",
          className,
        )}
      >
        <span>{label}</span>
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default SeeMoreButton;