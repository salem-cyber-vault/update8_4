import * as React from "react";

export default function FloatingEyesBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Subtle floating eyes animation */}
      <svg width="100vw" height="100vh" style={{ position: 'absolute', top: 0, left: 0 }}>
        <g>
          {/* Example: 3 pairs of eyes, can be randomized for more effect */}
          <ellipse cx="20%" cy="30%" rx="18" ry="8" fill="#222" opacity="0.12" />
          <ellipse cx="22%" cy="30%" rx="6" ry="6" fill="#fff" opacity="0.18" />
          <ellipse cx="80%" cy="70%" rx="18" ry="8" fill="#222" opacity="0.12" />
          <ellipse cx="82%" cy="70%" rx="6" ry="6" fill="#fff" opacity="0.18" />
          <ellipse cx="50%" cy="50%" rx="24" ry="10" fill="#222" opacity="0.10" />
          <ellipse cx="52%" cy="50%" rx="8" ry="8" fill="#fff" opacity="0.15" />
        </g>
      </svg>
    </div>
  );
}
