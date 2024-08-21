import React, { useState, useEffect } from 'react';

const DraggableSquare = () => {
  const [position, setPosition] = useState({ x: 650, y: 0 });

  const handleMouseMove = (e) => {
    const maxX = window.innerWidth - 150;
    const newX = Math.min(e.clientX, maxX);
    setPosition({
      x: newX,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';

    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        bottom: `0px`,
        width: '150px',
        height: '50px',
        backgroundColor: 'blue',
        cursor: 'none',
      }}
    ></div>
  );
};

export default DraggableSquare;
