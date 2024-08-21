import React, { useState, useEffect, useRef, useCallback} from 'react';
import './App.css';

const getRandomX = () => Math.floor(Math.random() * (window.innerWidth - 30));

const getRandomType = () => Math.random() < 0.7 ? 'good' : 'bad';

const getRandomBadImage = () => {
  const images = ['candy1.png', 'candy2.png', 'candy3.png', 'candy4.png'];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const getRandomGoodImage = () => {
  const images = ['carrot.png', 'apple.png', 'green-apple.png', 'broccoli.png', 'tomato.png'];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const App = () => {
  const [playerX, setPlayerX] = useState(window.innerWidth / 2);
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [pointsX, setPointsX] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const playerXRef = useRef(playerX);
  const caughtItemsRef = useRef(new Set());
  const lastItemTimeRef = useRef(0);
  const minItemInterval = 1000;

  const starThresholds = useRef([10, 25, 50]).current;
  const pointXThresholds = useRef([1, 2, 3]).current;


  useEffect(() => {
    const handleMouseMove = (event) => {
      const newX = event.clientX - 50;
      setPlayerX(newX);
      playerXRef.current = newX;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return() => {
      document.removeEventListener('mousemove', handleMouseMove)
    };
  }, []);

    const addItem = useCallback(() => {
      if(gameOver || isPaused) return;

      const type = getRandomType();

      const newItem = {
        id: Date.now(),
        x: getRandomX(),
        y: 0,
        type,
        image: type === 'good' ? getRandomGoodImage() : getRandomBadImage()
      };
      setFallingItems((items) => [...items, newItem]);
    }, [gameOver, isPaused]);

    const moveItems = useCallback(() => { 
      if (isPaused) return;

      setFallingItems((items) => {
        const updatedItems = items
        .map((item) => ({
          ...item,
          y: item.y + 5,
        }));

        updatedItems.forEach((item) => {
          if (
            item.y + 30 >= window.innerHeight - 150 &&
            item.y < window.innerHeight - 100 &&
            item.x >= playerXRef.current - 50 &&
            item.x <= playerXRef.current + 150
          ) {
            if (!caughtItemsRef.current.has(item.id)) {

              if (item.type === 'good'){
                setScore((prev) => prev + 1)
              } else if (item.type === 'bad') {
                setPointsX((prev) => prev + 1)
              }
              caughtItemsRef.current.add(item.id);
            }
          }
        });
        updatedItems.forEach((item) => {
          if (item.y >= window.innerHeight && !caughtItemsRef.current.has(item.id)) {
            if (item.type === 'good') {
              setScore((prev) => Math.max(prev - 1, 0));
            }
            caughtItemsRef.current.add(item.id);
          }
        })

      return updatedItems.filter((item) => item.y < window.innerHeight && !caughtItemsRef.current.has(item.id));
    });
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if(event.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if(gameOver || isPaused) return;

    const gameLoop = () => {
      if (isPaused) return;
      moveItems();

      const now = Date.now();
      if (now - lastItemTimeRef.current >= minItemInterval) {
        addItem();
        lastItemTimeRef.current = now;
      }
    };

    const interval = setInterval(gameLoop, 30);

    return () => 
      clearInterval(interval);
  }, [addItem, moveItems, gameOver, isPaused]);

  const getStars = () => {
    if (score >= starThresholds[2]) return 3;
    if (score >= starThresholds[1]) return 2;
    if (score >= starThresholds[0]) return 1;
    return 0;
  };

  const getPointsX = useCallback(() => {
    if (pointsX >= pointXThresholds[2]) return 3;
    if (pointsX >= pointXThresholds[1]) return 2;
    if (pointsX >= pointXThresholds[0]) return 1;
    return 0;
  }, [pointsX, pointXThresholds]);

  useEffect(() => {
    if (getPointsX() === 3) {
      setGameOver(true);
    }
  }, [pointsX, getPointsX])

  const restartGame = () => {
    setPlayerX(window.innerWidth / 2);
    setFallingItems([]);
    setScore(0);
    setPointsX(0);
    setGameOver(false);
    caughtItemsRef.current.clear();
    lastItemTimeRef.current = 0;
  }

  return (
    <div className="game-container">
      <div
        className="player"
        style={{ left: playerX + 'px' }}
      ></div>
      {fallingItems.map((item) => (
        <div
          key={item.id}
          className={`item ${item.type}`}
          style={{
            left: item.x + 'px',
            top: item.y + 'px',
            backgroundImage: `url(${process.env.PUBLIC_URL}/${item.image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      ))}
      <div className='scores'>
        <div className="score">{score}</div>
      </div>
      
      <div className='black-stars'>
      {[...Array(3).keys()].map(i => (
          <div
          key ={i}
          className='black-star'
        ></div>
        ))}
      </div>

      <div className="stars">
        {[...Array(3).keys()].map(i => (
          <div
          key ={i}
          className={`star ${getStars() > i ? 'active' : ''}`}
        ></div>
        ))}
      </div>

      
      <div className="black-pointsX">
        {[...Array(3).keys()].map(i => (
          <div
          key ={i}
          className = "black-pointX"
        ></div>
        ))}
      </div>

      <div className="pointsX">
        {[...Array(3).keys()].map(i => (
          <div
          key ={i}
          className={`pointX ${getPointsX() > i ? 'active' : ''}`}
        ></div>
        ))}
      </div>

      {gameOver && (
        <div classname="game-over-container">
          <div className="game-over">
            <h1>Game Over!</h1>
            <p>You have caught 3 red items!</p>
            <h2 onClick={restartGame}>RESTART</h2>
          </div>
        </div>
      )}

      {isPaused && (
          <div className="stop">
            <h1>STOP</h1>
            <p>Press ESC to play!</p>
          </div>
      )}

      {!isPaused && (
          <div className="info">
            <p>Press ESC to pause!</p>
          </div>
      )}
    </div>
  );
};

export default App;
