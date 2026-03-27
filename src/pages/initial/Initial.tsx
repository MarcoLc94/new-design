import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import "./Initial.css";

export const Initial = () => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hide navbar above screen initially
    gsap.set(".nav-bit", { yPercent: -100 });

    const ctx = gsap.context(() => {
      // Bouncing dot continuous animation in Phase 2
      gsap.to(".phase2-container .material-symbols-outlined", {
        y: -15, // Adjusted slightly
        duration: 0.3,
        ease: "power2.out",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".phase2-container .material-symbols-outlined", {
        scaleY: 0.9,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        transformOrigin: "bottom center",
      });

      // Scroll controlled timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=4000", // Pinned for 4000px of scrolling for full effect
          pin: true,     // Pin the container
          scrub: 1,      // Smooth scrubbing
          onUpdate: (self) => {
            const isPlayed = (window as any).navbarPlayed;
            if (self.progress >= 0.85) {
              if (!isPlayed) {
                (window as any).navbarPlayed = true;
                window.dispatchEvent(new CustomEvent("navbarPlay"));
              }
            } else {
              if (isPlayed) {
                (window as any).navbarPlayed = false;
                window.dispatchEvent(new CustomEvent("navbarReverse"));
              }
            }
          }
        },
      });

      // --- SCENE 1: PARALLAX ---
      // Moving character and text at different speeds
      tl.to(".parallax-text", { y: -300, opacity: 0, duration: 2 }, 0);
      tl.to(".character-img", { y: -150, x: 200, opacity: 0, duration: 2 }, 0);
      tl.to(".hero-bg-phase1", { scale: 1.1, opacity: 0, duration: 2 }, 0);

      // --- SCENE 2: BLACK BG & TEXT ZOOMS IN TO NORMAL ---
      // Fade in the black container overlay over Scene 1
      tl.to(".phase2-container", { opacity: 1, duration: 1 }, 1);
      
      // Text appears from huge, scaling down to its original size
      tl.fromTo(".splash-content", 
        { scale: 20, opacity: 0 },
        { scale: 1, opacity: 1, duration: 3, ease: "power2.out" },
        1
      );

      // PAUSE/HOLD SCENE 2 FOR A MOMENT
      tl.to({}, { duration: 2 });

      // --- SCENE 3: MOVE AWAY SCENE 2 REVEALING ORIGINAL BG, AND DROP NAVBAR ---
      // "se mueve la scena"
      tl.to(".phase2-container", { yPercent: -100, duration: 2, ease: "power2.inOut" });

      // Navbar drops after Scene 2 slides away
      tl.to(".nav-bit", {
        yPercent: 0,
        ease: "power2.out",
        duration: 1.5,
      }, "-=0.5");

    }, ref);

    return () => {
      ctx.revert();
      (window as any).navbarPlayed = false;
    };
  }, []);

  return (
    <div ref={ref} className="container">
      {/* Base Background for Phase 1 and 3 */}
      <img src="assets/background.png" className="hero-bg hero-bg-base" alt="background" />
      <img src="assets/background.png" className="hero-bg hero-bg-phase1" alt="background parallax" />
      
      {/* Phase 1 Overlay */}
      <div className="phase1-container">
        <div className="parallax-text-container">
          <h1 className="parallax-text">Innovación<br/><span>Tecnológica</span></h1>
        </div>
        <img src="assets/character.png" className="character-img" alt="character" />
      </div>

      {/* Phase 2: Splash Logo and Black background */}
      <div className="phase2-container">
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
