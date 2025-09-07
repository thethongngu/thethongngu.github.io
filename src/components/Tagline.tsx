import { useState } from 'react';

const Tagline = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const originalTagline = "life is about maximizing (long-term) good experience";
  const hoverTagline = "by building stupid things on the internet";

  return (
    <p
      className="font-code text-sm text-gray-600 mt-2 font-light transition-opacity duration-300 cursor-pointer before:content-['>_'] before:text-blue-600 before:mr-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? hoverTagline : originalTagline}
    </p>
  );
};

export default Tagline;
