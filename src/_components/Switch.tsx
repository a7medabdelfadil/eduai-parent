import React, { useEffect, useState } from "react";

interface SwitchProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Switch: React.FC<SwitchProps> = ({ theme, setTheme }) => {
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    setTheme(isDark ? "dark" : "light");
  }, [isDark, setTheme]);

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
      />
      <div className="h-6 w-12 md:h-8 md:w-16 rounded-full bg-gradient-to-r from-sky-200 to-sky-400 transition-all duration-500 after:absolute after:left-1 after:top-1 after:flex after:h-4 after:w-4 md:after:h-6 md:after:w-6 after:items-center after:justify-center after:rounded-full after:bg-white after:text-sm md:after:text-lg after:shadow-md after:transition-all after:duration-500 after:content-['☀️'] peer-checked:from-blue-400 peer-checked:to-indigo-500 peer-checked:after:translate-x-8 peer-checked:after:content-['🌙']" />
    </label>
  );
};

export default Switch;