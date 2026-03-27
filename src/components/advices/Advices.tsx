import React, { useState, useEffect, useRef } from "react";
import "./Advices.css";
import gsap from "gsap";

const testimonials = [
  {
    quote: "Gracias a BitFarm, logramos reducir un 40% el tiempo invertido en tareas administrativas. Más que una plataforma, encontramos un verdadero aliado.",
    author: "Claudia Monteros",
    role: "Directora de Procesos"
  },
  {
    quote: "Gracias a sus soluciones de automatización, logramos reducir tiempos en nuestros procesos internos sin necesidad de cambiar toda nuestra infraestructura.",
    author: "Victor Rodríguez Vega",
    role: "Director de Finanzas, W Financial"
  },
  {
    quote: "Con su tecnología logramos integrar diferentes áreas de la empresa en una sola plataforma. Fue una solución hecha a la medida, sin complicaciones.",
    author: "Alessandro Urpi",
    role: "Director General, Compufomento"
  },
  {
    quote: "Gracias a BitFarm, logramos reducir un 40% el tiempo invertido en tareas administrativas. Más que una plataforma, encontramos un verdadero aliado.",
    author: "Claudia Monteros",
    role: "Directora de Procesos"
  },
  {
    quote: "Gracias a sus soluciones de automatización, logramos reducir tiempos en nuestros procesos internos sin necesidad de cambiar toda nuestra infraestructura.",
    author: "Victor Rodríguez Vega",
    role: "Director de Finanzas, W Financial"
  },
  {
    quote: "Con su tecnología logramos integrar diferentes áreas de la empresa en una sola plataforma. Fue una solución hecha a la medida, sin complicaciones.",
    author: "Alessandro Urpi",
    role: "Director General, Compufomento"
  },
  {
    quote: "Nos sorprendió lo accesible que fue implementar la solución. Demostraron que la innovación puede ser simple, cercana y muy efectiva.",
    author: "Gilberto Hernández",
    role: "Director General, Cloud Systems"
  },
  {
    quote: "Lo que más valoramos es el acompañamiento. No solo implementaron la herramienta, también nos guiaron paso a paso para adoptarla.",
    author: "Cecilia Villarreal",
    role: "Business Manager, GVD Logistics"
  }
];

export const Advices = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quoteRef.current) {
      // Fade in/out transition using GSAP
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  // Auto-play feature
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="advices-container">
      <div className="overlay-advices"></div>
      
      <div className="content-wrapper">
        <h1 className="advices-title">Lo que nuestros clientes dicen:</h1>
        
        <div className="carousel-main" ref={quoteRef}>
          <div className="testimonial-card">
            <p className="quote-text">"{testimonials[activeIndex].quote}"</p>
            <div className="author-info">
              <h4 className="author-name">{testimonials[activeIndex].author}</h4>
              <p className="author-role">{testimonials[activeIndex].role}</p>
            </div>
          </div>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
