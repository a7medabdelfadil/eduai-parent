import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

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
      <div
        className={`h-8 w-16 rounded-full transition-colors duration-500 ${
          isDark ? "bg-[#C8BCF6]" : "bg-[#F4F4F4]"
        } relative`}
      >
        <div
          className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 shadow-md ${
            isDark
              ? "translate-x-8 bg-black text-[#C8BCF6]"
              : "bg-[#C8BCF6] text-[#F4F4F4]"
          }`}
        >
          {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
        </div>
      </div>
    </label>
  );
};

export default Switch;
