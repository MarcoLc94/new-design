import { useEffect, useRef } from "react";
import "./Navbar.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Navbar = () => {
  const navbarRef = useRef<HTMLSpanElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!navbarRef.current || !imgRef.current || !navContainerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // ---- 1. Logo Dot Bounces ----
      tl.set(navbarRef.current, {
        x: 150,
        y: -20,
        opacity: 0,
        transformOrigin: "bottom center",
      });

      tl.to(navbarRef.current, { opacity: 1, duration: 0.1 }, 0);

      tl.to(
        navbarRef.current,
        {
          x: 0,
          y: -10,
          duration: 1.5,
          ease: "power1.out",
        },
        0,
      );

      const bounceHeights = [-30, -30, -30, -30, -30, -35];
      let startTime = 0;

      bounceHeights.forEach((height) => {
        tl.to(
          navbarRef.current,
          {
            y: height,
            duration: 0.2,
            ease: "sine.out",
          },
          startTime,
        );

        tl.to(
          navbarRef.current,
          {
            y: 0,
            duration: 0.2,
            ease: "sine.in",
          },
          startTime + 0.1,
        );

        startTime += 0.2;
      });

      // ---- 2. Logo Fade In ----
      tl.from(
        imgRef.current,
        {
          y: -50,
          opacity: 0,
          duration: 0.3,
        },
        0 // starts with the dot
      );

      // ---- 3. Links Fade In ----
      tl.from(
        ".links-bit li",
        {
          y: -25,
          opacity: 0,
          duration: 0.3,
          stagger: 0.2,
        },
        0 // starts with the dot
      );

      // ---- Event Listeners to Trigger Timeline ----
      const handlePlay = () => tl.play();
      const handleReverse = () => tl.reverse();

      window.addEventListener("navbarPlay", handlePlay);
      window.addEventListener("navbarReverse", handleReverse);

      // ---- Scroll trigger para fondo y repeticion de la animacion ----
      ScrollTrigger.create({
        start: "top -50",
        onEnter: () => {
          gsap.to(navContainerRef.current, { backgroundColor: "#2d2d2d", duration: 0.3 });
          tl.restart();
        },
        onLeaveBack: () => {
          gsap.to(navContainerRef.current, { backgroundColor: "transparent", duration: 0.3 });
        }
      });

      return () => {
        window.removeEventListener("navbarPlay", handlePlay);
        window.removeEventListener("navbarReverse", handleReverse);
      };
    }, navContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="nav-bit" ref={navContainerRef}>
      <h1>
        <span className="material-symbols-outlined" ref={navbarRef}>
          fiber_manual_record
        </span>
        <img
          ref={imgRef}
          src="assets/logo-bitfarm-blanco.png"
          alt=""
          width={120}
        />
      </h1>
      <ul className="links-bit">
        <li>Inicio</li>
        <li>Soluciones</li>
        <li>Blog</li>
        <li>Contacto</li>
      </ul>
    </div>
  );
};
