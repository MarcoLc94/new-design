import React, { useEffect, useRef } from "react";

class DigitalParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  value: string;
  opacity: number;
  isForeground: boolean;
  baseX: number;
  baseY: number;

  constructor(width: number, height: number, isForeground: boolean) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = isForeground ? Math.random() * 14 + 16 : Math.random() * 8 + 8; // Foreground larger
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.value = Math.random() > 0.5 ? "1" : "0";
    // Extra low opacity as requested
    this.opacity = isForeground ? Math.random() * 0.15 + 0.1 : Math.random() * 0.1 + 0.05;
    this.isForeground = isForeground;
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    // Basic movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x > width + 50) this.x = -50;
    if (this.x < -50) this.x = width + 50;
    if (this.y > height + 50) this.y = -50;
    if (this.y < -50) this.y = height + 50;

    // Repulsion from mouse
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Repulsion radius: larger for foreground to create depth effect
    const maxDistance = this.isForeground ? 220 : 160; 
    
    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      // Push away from cursor
      this.x -= (dx / distance) * force * (this.isForeground ? 5 : 3);
      this.y -= (dy / distance) * force * (this.isForeground ? 5 : 3);
    }

    // Randomly flip value for matrix effect
    if (Math.random() < 0.015) {
      this.value = this.value === "0" ? "1" : "0";
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = `600 ${this.size}px monospace`;
    ctx.fillStyle = `rgba(0, 182, 62, ${this.opacity})`; // Match green #00b63e color approximately
    ctx.fillText(this.value, this.x, this.y);
  }
}

export const HeroCanvas = () => {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bgCanvas = bgRef.current;
    const fgCanvas = fgRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    if (!bgCtx || !fgCtx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let bgParticles: DigitalParticle[] = [];
    let fgParticles: DigitalParticle[] = [];

    const initParticles = () => {
      bgParticles = [];
      fgParticles = [];
      
      const area = window.innerWidth * window.innerHeight;
      const bgCount = Math.floor(area / 6000); 
      const fgCount = Math.floor(area / 15000);

      for (let i = 0; i < bgCount; i++) {
        bgParticles.push(new DigitalParticle(window.innerWidth, window.innerHeight, false));
      }
      for (let i = 0; i < fgCount; i++) {
        fgParticles.push(new DigitalParticle(window.innerWidth, window.innerHeight, true));
      }
    };

    const resize = () => {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      fgCanvas.width = window.innerWidth;
      fgCanvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

      const width = window.innerWidth;
      const height = window.innerHeight;

      bgParticles.forEach((p) => {
        p.update(width, height, mouseX, mouseY);
        p.draw(bgCtx);
      });

      fgParticles.forEach((p) => {
        p.update(width, height, mouseX, mouseY);
        p.draw(fgCtx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Background Layer: behind hero elements. We keep the class hero-bg-phase1 because it's animated by GSAP early on */}
      <div className="hero-bg-phase1" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
        <canvas ref={bgRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      
      {/* Foreground Layer: in front of hero elements. Given high z-index but no pointer events so buttons are still clickable */}
      <div className="hero-fg-phase1" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }}>
        <canvas ref={fgRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </>
  );
};
