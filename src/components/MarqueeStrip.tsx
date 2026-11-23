import React from 'react';

export const MarqueeStrip: React.FC = () => {
  const text = 'BIRTHDAYS + WEDDINGS + BALLOONS + FLOWERS +';

  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-content">
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
        </div>
        <div className="marquee-content">
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
          <span className="marquee-item">{text}</span>
        </div>
      </div>
    </div>
  );
};
