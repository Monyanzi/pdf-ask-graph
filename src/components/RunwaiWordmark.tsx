import React from 'react';

export const RunwaiWordmark = () => {
  return (
    <div className="flex items-center">
      <svg width="120" height="32" viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
        <text
          x="0"
          y="24"
          fontSize="20"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.5px"
        >
          <tspan fill="hsl(var(--primary))" className="fill-primary">R</tspan>
          <tspan fill="hsl(var(--foreground))" className="fill-foreground">UNWAI</tspan>
        </text>
      </svg>
    </div>
  );
};