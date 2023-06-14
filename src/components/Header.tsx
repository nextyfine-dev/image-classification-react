import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("isDarkMode") === "true" ? true : false
  );

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    const removeTheme = isDarkMode ? "light" : "dark";
    const root = window.document.documentElement;
    root.classList.remove(removeTheme);
    root.classList.add(theme);
  }, [isDarkMode]);

  return (
    <div className="sticky top-0">
      <nav className="relative px-8 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-bold">IMAGE CLASSIFICATION REACT</h2>

        <ul className="flex items-center justify-end grow mr-4">
          <li>
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}
