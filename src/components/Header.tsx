import { useState, useEffect } from 'react';
import Tagline from './Tagline';

interface HeaderProps {
  activeNav?: string;
}

const Header = ({ activeNav }: HeaderProps) => {
  useEffect(() => {
    // Homepage navigation functionality
    const headerTitle = document.getElementById("header-title");
    if (!headerTitle) return;

    const handleClick = () => {
      window.location.href = "/";
    };

    headerTitle.addEventListener("click", handleClick);

    // Cleanup event listener
    return () => {
      headerTitle.removeEventListener("click", handleClick);
    };
  }, []);

  const getNavLinkClass = (navItem: string) => {
    const baseClass = "no-underline px-3 py-2 rounded text-sm transition-all duration-200 border";
    const activeClass = "bg-blue-600 text-white border-blue-600";
    const inactiveClass = "text-gray-800 bg-white border-gray-300 hover:border-blue-600 hover:text-blue-600";
    
    return `${baseClass} ${activeNav === navItem ? activeClass : inactiveClass}`;
  };

  return (
    <header className="text-center px-4 py-8 bg-gray-50 border-b border-gray-300">
      <div
        className="flex items-center justify-center gap-3 cursor-pointer hover-title"
        id="header-title"
      >
        <img
          src="/assets/icon.jpeg"
          alt="thethongngu icon"
          className="h-5 w-auto rounded border border-gray-300 transition-transform duration-200 hover:scale-105"
        />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 m-0">
          thethongngu
        </h1>
      </div>
      <Tagline />
      <nav className="flex justify-center gap-4 mt-6 flex-wrap">
        <a href="/about" className={getNavLinkClass("about")}>
          about
        </a>
        <a href="/projects" className={getNavLinkClass("projects")}>
          projects
        </a>
        <a href="/notes" className={getNavLinkClass("notes")}>
          notes
        </a>
        <a href="/comic" className={getNavLinkClass("comic")}>
          comics
        </a>
      </nav>
    </header>
  );
};

export default Header;
