import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';


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
            alpha: 0
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

      // Плавно сглаживаем скорость, чтобы не было рывков
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
            const proximity = 1 - (distance / maxDist);
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

export default function DownloadFlow() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const WORKER_URL = "https://kali-download.vblox.lol/?url=download";
  const handleStartProcess = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = WORKER_URL;
    }, 800);
  };

  return (
    <div className="bg-[#050505] min-h-screen relative flex flex-col items-center px-6 selection:bg-white/20">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
      </div>
      
      <BinaryMatrixBackground />
      <nav className="absolute top-0 w-full z-50 py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img src="/logo.png" alt="Kali Logo" className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="font-vk font-semibold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">Kali</span>
          </Link>
          <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <a href="https://docs.vblox.lol/" className="hover:text-white transition-colors">Engine</a>
            <a href="https://t.me/KaliExecutor" className="hover:text-white transition-colors">Telegram</a>
          </div>
        </div>
      </nav>
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          <div className="mb-8">
             <img src="/logo.png" alt="Kali Icon" className="w-12 h-12 object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>
          <h1 className="font-vk text-6xl sm:text-7xl md:text-[85px] leading-[1.05] font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
            Download.<br />
            Launch Kali.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-10 font-light">
            Get the Windows build. One short verification step. And Kali is ready to launch.
          </p>
          <button 
            onClick={handleStartProcess}
            disabled={isRedirecting}
            className="group relative bg-white text-black px-8 py-3.5 rounded-full font-medium text-[15px] flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95 transition-all duration-200 overflow-hidden disabled:opacity-80 disabled:hover:scale-100"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black/70" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                <span className="relative z-10 font-semibold tracking-wide">Download for Windows</span>
              </>
            )}
          </button>
          <p className="mt-6 text-[11px] text-zinc-600 max-w-sm">
            By downloading, you agree to the <a href="https://raw.githubusercontent.com/jealleal/kaliwebprivacy/refs/heads/main/terms" className="underline hover:text-zinc-400 transition-colors">Terms of Service</a> and <a href="https://raw.githubusercontent.com/jealleal/kaliwebprivacy/refs/heads/main/privacy" className="underline hover:text-zinc-400 transition-colors">Privacy Policy</a>.
          </p>

        </motion.div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
}