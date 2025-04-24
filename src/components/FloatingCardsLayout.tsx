
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardsLayoutProps {
  children: React.ReactNode[];
}

const FloatingCardsLayout = ({ children }: FloatingCardsLayoutProps) => {
  return (
    <div className="relative w-full h-[800px] flex items-center justify-center">
      {children.map((child, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            z: -50 * index,
            rotate: index % 2 === 0 ? 3 : -3,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.2,
            ease: "easeOut"
          }}
          style={{
            transform: `translateY(${index * 20}px) translateZ(${-50 * index}px)`,
            filter: `brightness(${1 - index * 0.1})`,
            zIndex: children.length - index,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCardsLayout;
