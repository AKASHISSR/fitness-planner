import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ className, color = '#4fd165', count = 50, speed = 0.5, size = 2, opacity = 0.3, interactive = true }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      if (interactive) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * size + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * speed;
        const speedY = (Math.random() - 0.5) * speed;
        
        particles.push({
          x,
          y,
          radius,
          baseRadius: radius,
          speedX,
          speedY,
          color,
          opacity: Math.random() * opacity + 0.1
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
          particle.speedY = -particle.speedY;
        }
        
        // Mouse interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null && interactive) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRef.current.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            
            particle.x += Math.cos(angle) * force * 2;
            particle.y += Math.sin(angle) * force * 2;
            particle.radius = particle.baseRadius + (particle.baseRadius * force);
          } else {
            particle.radius = particle.baseRadius;
          }
        } else {
          particle.radius = particle.baseRadius;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
        ctx.fill();
        
        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${hexToRgb(particle.color)}, ${(150 - distance) / 150 * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Helper to convert hex to rgb
    const hexToRgb = (hex) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert 3-digit hex to 6-digits
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    };

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, count, speed, size, opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ParticleBackground;
