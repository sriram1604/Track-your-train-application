import React, { useEffect } from 'react';

// The Intro component handles the animated splash screen.
const Intro = ({ onFinish }) => {
  const text = "Track Your Train";

  // After the animation duration, call the onFinish callback
  useEffect(() => {
    // The total animation duration is set to 6.5 seconds in the CSS.
    // We add a small buffer here to ensure the animation finishes smoothly.
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 6700);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-container absolute inset-0 flex flex-col items-center justify-center">
      {/* Train icon with its own animation */}
      
      {/* Animated text, with a letter-by-letter animation */}
      <h1 className="font-bold text-6xl">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="letter inline-block opacity-0"
            style={{ animationDelay: `${1.5 + index * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Intro;
