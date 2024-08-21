
import React, { useState, useEffect } from 'react';

const DraggableImage = () => {
    const [isDragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 1000, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
    const handleMouseDown = (e) => {
      e.preventDefault();
      setDragging(true);
      setPosition({ x: e.clientX - 100, y: e.clientY - 100 });
    };
  
    const handleMouseUp = () => {
      setDragging(false);
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - 30;
      const newY = e.clientY - 50;
  
      // Aktualizacja pozycji tylko jeśli nowa pozycja mieści się w oknie
      if (newX >= 0 && newX <= window.innerWidth - imageSize.width && newY >= 0 && newY <= window.innerHeight - imageSize.height) {
        setPosition({ x: newX, y: newY });
      }
    };
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (!isDragging) {
          setPosition(prevPosition => ({
            ...prevPosition,
            y: prevPosition.y <= 500 ? prevPosition.y + 1 : prevPosition.y
          }));
        }
      }, 3);
  
      // Pobierz rozmiar obrazka
      const img = document.getElementById("carrot-img");
      if (img) {
        setImageSize({ width: img.width, height: img.height });
      }
  
      return () => clearInterval(intervalId);
    }, [isDragging]);
  
    return (
      <div>
        <img
          src="/carrot.png"
          alt="Marchewka"
          className="items"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            position: 'absolute',
            xIndex: 4,
            left: position.x,
            top: position.y,
          }}
          id="carrot-img"
        />
      </div>
    );
  };
  
  export default DraggableImage;