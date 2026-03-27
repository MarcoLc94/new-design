import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import "./Initial.css";
import { HeroCanvas } from "../../components/HeroCanvas";

export const Initial = () => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Configuraciones iniciales DOM
      const globalNav = document.querySelector(".nav-bit");
      if (globalNav) gsap.set(globalNav, { opacity: 0 }); // Navbar invisible

      // Elementos del Parallax escondidos detrás y un poco más abajo/escalados
      gsap.set(".character-img", { y: 250, opacity: 0 });
      gsap.set(".hero-bg-phase1, .hero-fg-phase1", { scale: 1.2, opacity: 0 });

      // Textos y botones iniciales ocultos para animaciones de entrada
      gsap.set(".parallax-text span", { y: 50, opacity: 0 });
      gsap.set(".parallax-subtitle", { y: 30, opacity: 0 });
      gsap.set(".parallax-buttons button", { y: 20, opacity: 0, scale: 0.8 });

      // Bouncing dot hero loop
      gsap.to(".hero-splash .material-symbols-outlined", {
        y: -15,
        duration: 0.3,
        ease: "power2.out",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".hero-splash .material-symbols-outlined", {
        scaleY: 0.9,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        transformOrigin: "bottom center",
      });

      // Temporarily disable scroll while splash screen is active
      document.body.style.overflow = "hidden";

      // Automatic sequence timeline
      const tl = gsap.timeline({
        onUpdate: function () {
          const isPlayed = (window as any).navbarPlayed;
          if (this.progress() >= 0.65) {
            // Disparamos evento para mostrar animaciones del navbar
            if (!isPlayed) {
              (window as any).navbarPlayed = true;
              window.dispatchEvent(new CustomEvent("navbarPlay"));
            }
          }
        },
        onComplete: () => {
          // Restore scroll when intro is complete
          document.body.style.overflow = "auto";
        },
      });

      // --- HOLD inicial (la pantalla inicial dura solo 0.1s) ---
      tl.to({}, { duration: 0.1 });

      // El Splash screen negro se hace gigante y se desvanece
      tl.to(
        ".splash-content",
        { scale: 5, opacity: 0, duration: 0.8, ease: "power2.in" },
        0.1,
      );
      tl.to(".hero-splash", { opacity: 0, duration: 0.8 }, 0.3);

      // --- FONDO y NAVBAR entran al MISMO tiempo independientemente copiando opacidad ---
      tl.to(".hero-bg-phase1, .hero-fg-phase1", { opacity: 1, scale: 1, duration: 1 }, 0.3);
      if (globalNav) {
        tl.to(
          globalNav,
          {
            opacity: 1,
            duration: 1,
          },
          0.3,
        );
      }

      // --- LUEGO entra el Character y Text y "llegan para quedarse" ---
      tl.to(
        ".parallax-text span",
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        0.5
      );
      tl.to(
        ".parallax-subtitle",
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
      tl.to(
        ".parallax-buttons button",
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" },
        "-=0.6"
      );

      tl.to(
        ".character-img",
        { y: 0, opacity: 1, duration: 1, ease: "power1.out" },
        0.8,
      );

      // Agregamos el Efecto Parallax Interactivo con el Cursor
      const handleMouseMove = (e: MouseEvent) => {
        // Obtenemos coordenadas relativas de -1 a 1 según la ubicación de centro de pantalla
        let xPos = (e.clientX / window.innerWidth - 0.5) * 2;
        let yPos = (e.clientY / window.innerHeight - 0.5) * 2;

        // Limite de 10% menos del viewport para evitar desbordes
        const limit = 0.9;
        xPos = Math.max(-limit, Math.min(limit, xPos));
        yPos = Math.max(-limit, Math.min(limit, yPos));

        // El fondo se mueve más lento
        gsap.to(".hero-bg-base", {
          xPercent: xPos * 1.5,
          yPercent: yPos * 1.5,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        // El texto se mueve lado opuesto para el efecto de profundidad 3D invertida
        gsap.to(".parallax-content-group", {
          xPercent: -xPos * 3,
          yPercent: -yPos * 3,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        // El character responde rapidísimo dando sensación frontal
        gsap.to(".character-img", {
          xPercent: xPos * 6,
          yPercent: yPos * 6,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      // Registrar los escuchas de movimiento del ratón globalmente
      window.addEventListener("mousemove", handleMouseMove);

      // --- EFECTO DE DISPERSIÓN INDIVIDUAL AL SCROLL ---
      // Distintos elementos se mueven en diferentes direcciones para dar efecto de "explosión" o dispersión
      const scrollSettings = {
        trigger: ".container",
        start: "top top",
        end: "bottom top",
        scrub: true, // Respuesta inmediata al subir scroll
        immediateRender: false // Esperamos a que la entrada inicial termine
      };

      // Las líneas de texto salen disparadas hacia la izquierda y arriba con rotación
      gsap.fromTo(".parallax-text span", 
        { x: 0, y: 0, rotation: 0, opacity: 1, filter: "blur(0px)" },
        {
          scrollTrigger: scrollSettings,
          x: (index: number) => -200 - (index * 100),
          y: (index: number) => -50 - (index * 50),
          rotation: (index: number) => -15 - (index * 5),
          opacity: 0,
          filter: "blur(15px)",
          ease: "none"
        }
      );

      // El subtítulo baja un poco y se va a la derecha
      gsap.fromTo(".parallax-subtitle", 
        { x: 0, y: 0, opacity: 1, filter: "blur(0px)" },
        {
          scrollTrigger: scrollSettings,
          x: 100,
          y: 100,
          opacity: 0,
          filter: "blur(10px)",
          ease: "none"
        }
      );

      // Los botones se achican y se dispersan hacia abajo
      gsap.fromTo(".parallax-buttons button", 
        { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
        {
          scrollTrigger: scrollSettings,
          y: 200,
          scale: 0.5,
          stagger: 0.1,
          opacity: 0,
          filter: "blur(8px)",
          ease: "none"
        }
      );

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, ref);

    return () => {
      ctx.revert();
      (window as any).navbarPlayed = false;
      document.body.style.overflow = "auto"; // Ensure scroll is restored on unmount
    };
  }, []);

  return (
    <div ref={ref} className="container">
      {/* Base Background for Phase 1 and 3 */}
      <img
        src="assets/background.png"
        className="hero-bg hero-bg-base"
        alt="background"
      />
      
      {/* Hacker Matrix Effects (Background & Foreground) */}
      <HeroCanvas />

      {/* Phase 1 Overlay */}
      <div className="phase1-container">
        <div className="parallax-text-container">
          <div className="parallax-content-group">
            <h1 className="parallax-text">
              <span className="text-light">Software a la medida</span>
              <br />
              <span className="text-highlight">+ Inteligencia Artificial</span>
              <br />
              <span className="text-light">para tu empresa.</span>
            </h1>
            <p className="parallax-subtitle">
              Desarrollamos. Integramos. Transformamos.
            </p>
            <div className="parallax-buttons">
              <button className="btn-primary">Solicita una demo</button>
              <button className="btn-secondary">Agenda una llamada</button>
            </div>
          </div>
        </div>
        <img
          src="assets/character.png"
          className="character-img"
          alt="character"
        />
      </div>

      {/* Hero Section: fondo negro y logo inicial con saltito animado constante */}
      <div className="hero-splash">
        <div className="splash-content">
          <span className="material-symbols-outlined">fiber_manual_record</span>
          <h1 className="imageLogo">
            Bit <span>farm</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
