import { useEffect, useRef } from 'react';
import { Game } from '../game/core/Game';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize game
    const game = new Game(containerRef.current);
    gameRef.current = game;
    game.start();

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        game.resize(clientWidth, clientHeight);
      }
    };

    // Initial resize
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}