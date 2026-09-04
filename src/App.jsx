import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Download, Zap, Shield, Sparkles, Globe, ChevronLeft, ChevronRight, CheckCircle2, Users, Rocket, Code2, TerminalSquare } from 'lucide-react';
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
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 200, damping: 20 } },
};
const SpotlightCard = ({ icon: Icon, title, description }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={itemVariants}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#050505] p-8 transition-colors hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />
      <Icon className="w-5 h-5 mb-5 text-zinc-500 transition-colors duration-300 group-hover:text-white relative z-10" />
      <h3 className="font-vk text-xl font-medium mb-2 text-zinc-100 relative z-10">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, isLoading }) => (
  <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-white/10 transition-colors">
    <Icon className="w-5 h-5 text-zinc-600 mb-3 group-hover:text-zinc-400 transition-colors" />
    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">{title}</h4>
    {isLoading ? (
      <div className="h-8 w-24 bg-white/10 rounded animate-pulse mt-1" />
    ) : (
      <span className="font-vk text-4xl font-bold text-white tracking-tight">{value}</span>
    )}
  </div>
);
export default function KaliApp() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [currentImg, setCurrentImg] = useState(0);
  const screenshots = [
    '/fake.png', 
    '/fake.png',
    '/fake.png'
  ];

  const nextImg = () => setCurrentImg((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  const prevImg = () => setCurrentImg((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));

  const [stats, setStats] = useState(null);

  useEffect(() => {
    scrollY.onChange((latest) => setIsScrolled(latest > 50));
    
    const fetchStats = setTimeout(() => {
      setStats({
        activeUsers: "14,592",
        launches: "1,204,853",
        scripts: "8,932,104"
      });
    }, 2000);

    return () => clearTimeout(fetchStats);
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      <BinaryMatrixBackground />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? 'border-white/10 bg-black/60 backdrop-blur-xl py-4' : 'border-transparent bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Kali Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <span className="font-vk font-semibold text-xl tracking-tight">Kali</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="" className="hover:text-white transition-colors">sUNC</a>
            <a href="https://docs.vblox.lol/" className="hover:text-white transition-colors">Engine</a>
            <a href="https://t.me/KaliExecutor" className="hover:text-white transition-colors">Telegram</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-colors">
              Login
            </button>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 max-w-[1000px] mx-auto pt-16 pointer-events-none">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col items-center w-full pointer-events-auto">
          
          <motion.h1 variants={itemVariants} className="font-vk text-6xl md:text-[85px] leading-[1.05] font-medium tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            The ultimate Luau <br className="hidden md:block"/> execution engine.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-light">
            Experience flawless compilation and complete stealth. Our executor is updating for every Roblox version, have 84% sUNC score, and supports a custom UI.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              to="/download" 
              className="group relative w-full sm:w-auto bg-white text-black px-10 py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <Download className="w-4 h-4" />
              <span className="relative z-10">Download</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      <section id="showcase" className="relative z-10 px-6 pb-24 max-w-[1000px] mx-auto w-full">
        
        <div className="relative group w-full aspect-video rounded-2xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.03)] mb-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg}
              src={screenshots[currentImg]}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Kali Interface"
            />
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={prevImg} className="w-10 h-10 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImg} className="w-10 h-10 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {screenshots.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImg(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImg ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent mb-8">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-[#050505] shadow-[0_0_30px_rgba(255,255,255,0.05)] relative">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <motion.circle 
                    cx="28" cy="28" r="26" fill="none" stroke="#fff" strokeWidth="2"
                    strokeDasharray="163"
                    initial={{ strokeDashoffset: 163 }}
                    whileInView={{ strokeDashoffset: 163 - (163 * 0.84) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  />
               </svg>
               <span className="font-vk text-sm font-bold">84%</span>
            </div>
            <div>
              <h3 className="font-vk text-lg font-medium text-white flex items-center gap-2">
                sUNC Score <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              </h3>
              <p className="text-sm text-zinc-500">Unmatched script compatibility.</p>
            </div>
          </div>

          <div className="w-full md:w-[60%] bg-[#050505] border border-white/5 p-4 rounded-xl">
             <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2">
                <span>Compatibility</span>
                <span className="font-vk text-white text-sm">84%</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "84%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                />
             </div>
          </div>
        </div>

        {/*
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} title="Active Users" value={stats?.activeUsers} isLoading={!stats} />
          <StatCard icon={Rocket} title="Total Launches" value={stats?.launches} isLoading={!stats} />
          <StatCard icon={Code2} title="Scripts Executed" value={stats?.scripts} isLoading={!stats} />
        </div>
        */} 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="editor"
          className="w-full rounded-2xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.02)] flex flex-col"
        >
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <h3 className="font-vk text-md font-medium text-zinc-200">Modern Luau 5.5.x Editor</h3>
            <div className="ml-auto flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
            </div>
          </div>
          <div className="h-[450px] w-full bg-[#141414] relative">
             <iframe 
                src="/editor.html" 
                title="Luau Monaco Editor"
                className="w-full h-full border-none outline-none"
             ></iframe>
          </div>
        </motion.div>
      </section>

      <section id="engine" className="relative z-10 px-6 pb-32 max-w-[1200px] mx-auto">
         <motion.div 
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           variants={containerVariants}
           className="grid md:grid-cols-3 gap-4"
         >
            <SpotlightCard icon={Zap} title="Native Compiler" description="A custom Luau environment developed from scratch in C++ to ensure maximum execution speed and complete freedom from crashes." />
            <SpotlightCard icon={Shield} title="True Undetect" description="Advanced stealth mechanisms mask our threads and memory by emulating Hyperion, allowing us to bypass Byfron undetected." />
            <SpotlightCard icon={Globe} title="Stability" description="Our executor injects into the process in 0.8s, ensuring absolute stability of the Luau VM." />
         </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-black">
        <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-600">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
             <img src="/logo.png" alt="Kali" className="w-4 h-4 opacity-50 grayscale" />
             jealeal © 2026 | Powered by Quasar
           </div>
           <div className="flex gap-6">
             <a href="https://raw.githubusercontent.com/jealleal/kaliwebprivacy/refs/heads/main/terms" className="hover:text-zinc-300 transition-colors">Terms</a>
             <a href="https://raw.githubusercontent.com/jealleal/kaliwebprivacy/refs/heads/main/privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
           </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}