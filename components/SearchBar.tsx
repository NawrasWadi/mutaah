"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all"
        placeholder="ابحث عن أدوات، كاميرات، مولدات..."
      />
    </div>
  );
}