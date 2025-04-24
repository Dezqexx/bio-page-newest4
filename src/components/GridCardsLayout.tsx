
import React from 'react';

interface GridCardsLayoutProps {
  children: React.ReactNode;
}

const GridCardsLayout = ({ children }: GridCardsLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4">
      {children}
    </div>
  );
};

export default GridCardsLayout;
