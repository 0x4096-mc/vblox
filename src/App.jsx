import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BinaryMatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, speed: 0 };
    let lastX = -1000;
    let lastY = -1000;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const cellSize = 24;
    let columns, rows;
    let grid = [];

    const initGrid = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);
      grid = [];

      for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          grid[i][j] = {
            char: Math.random() > 0.5 ? '1' : '0',
            alpha: 0,
          };
        }
      }
    };

    initGrid();
    window.addEventListener('resize', initGrid);
    const draw = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
      const currentSpeed = Math.hypot(mouse.x - lastX, mouse.y - lastY);
      lastX = mouse.x;
      lastY = mouse.y;
      mouse.speed += (currentSpeed - mouse.speed) * 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px "JetBrains Mono", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const cell = grid[i][j];
          const cellX = i * cellSize + cellSize / 2;
          const cellY = j * cellSize + cellSize / 2;

          const distance = Math.hypot(mouse.x - cellX, mouse.y - cellY);
          const maxDist = 250;

          let targetAlpha = 0;
          if (mouse.speed > 0.1 && distance < maxDist) {
            const proximity = 1 - distance / maxDist;
            const intensity = Math.min(mouse.speed / 15, 1);
            targetAlpha = proximity * intensity * 0.2;
          }
          if (targetAlpha > cell.alpha) {
            cell.alpha += (targetAlpha - cell.alpha) * 0.17;
          } else {
            cell.alpha += (0 - cell.alpha) * 0.0075;
          }

          if (cell.alpha > 0.005) {
            ctx.fillStyle = `rgba(255, 255, 255, ${cell.alpha})`;
            ctx.fillText(cell.char, cellX, cellY);
          }
        }
      }
      if (Math.random() < 0.15) {
        const rx = Math.floor(Math.random() * columns);
        const ry = Math.floor(Math.random() * rows);
        grid[rx][ry].char = grid[rx][ry].char === '1' ? '0' : '1';
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', initGrid);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

const TypeWriter = ({ text, typeSpeed = 110, deleteSpeed = 55, holdTime = 1800, pauseTime = 600 }) => {
  const [count, setCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let delay = isDeleting ? deleteSpeed : typeSpeed;
    if (!isDeleting && count === text.length) delay = holdTime;
    if (isDeleting && count === 0) delay = pauseTime;

    const timer = setTimeout(() => {
      if (!isDeleting && count === text.length) {
        setIsDeleting(true);
      } else if (isDeleting && count === 0) {
        setIsDeleting(false);
      } else {
        setCount((c) => c + (isDeleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [count, isDeleting, text, typeSpeed, deleteSpeed, holdTime, pauseTime]);

  return (
    <span>
      {text.slice(0, count)}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[2px] h-[1em] bg-white ml-1 align-middle"
      />
    </span>
  );
};

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      <BinaryMatrixBackground />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.h1 variants={itemVariants} className="font-vk text-6xl md:text-[96px] leading-[1.05] font-medium tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            vblox.lol
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 font-light tracking-wide font-mono h-8">
            <TypeWriter text="coming soon..." />
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}