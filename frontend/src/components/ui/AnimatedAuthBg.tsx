"use client";

import { useEffect, useRef } from "react";

export default function AnimatedAuthBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const PARTICLE_COUNT = 60;
    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      color: string;
    };

    const COLORS = ["#FC0B0B", "#FAA41A", "#e03030", "#cc5500"];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      t += 0.008;
      const W = canvas.width;
      const H = canvas.height;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // Deep dark BG
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Soft radial glow — top-right red
      const g1 = ctx.createRadialGradient(W, 0, 0, W, 0, W * 0.7);
      g1.addColorStop(0, "rgba(252,11,11,0.08)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Soft radial glow — bottom-left amber
      const g2 = ctx.createRadialGradient(0, H, 0, 0, H, W * 0.7);
      g2.addColorStop(0, "rgba(250,164,26,0.06)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // Animated orbs
      const orbDefs = [
        { cx: W * 0.75, cy: H * 0.15, r: 180, color: "rgba(252,11,11,0.07)", speed: 0.4 },
        { cx: W * 0.2, cy: H * 0.8, r: 220, color: "rgba(250,164,26,0.05)", speed: 0.3 },
        { cx: W * 0.5, cy: H * 0.5, r: 140, color: "rgba(252,11,11,0.04)", speed: 0.6 },
      ];
      orbDefs.forEach((o) => {
        const ox = o.cx + Math.sin(t * o.speed) * 30;
        const oy = o.cy + Math.cos(t * o.speed * 0.7) * 20;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, o.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scanning line
      const scanY = ((t * 40) % (H + 60)) - 30;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, "rgba(252,11,11,0)");
      scanGrad.addColorStop(0.5, "rgba(252,11,11,0.06)");
      scanGrad.addColorStop(1, "rgba(252,11,11,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 40);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 2 + p.x));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Particle connections
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(252,11,11,${0.08 * (1 - dist / 90)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
