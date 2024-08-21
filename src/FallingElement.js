import React, { useState, useEffect } from 'react';

const FallingElement = ({ id, onRemove}) => {
  const [position, setPosition] = useState({ x: Math.random() * (window.innerWidth - 40), y: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition(prevPosition => {
        const newY = prevPosition.y + 5;
        if (newY >= window.innerHeight - 20) {
          onRemove(id); // Powiadom o usunięciu elementu
          clearInterval(intervalId);
          return prevPosition; // Zatrzymaj element na miejscu po osiągnięciu dołu
        }
        return { ...prevPosition, y: newY };
      });
    }, 50); // Interwał w ms

    return () => clearInterval(intervalId); // Oczyść interwał po odmontowaniu
  }, [id, onRemove]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
      }}
    ></div>
  );
};

export default FallingElement;
