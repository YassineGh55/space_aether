import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const stars: { x: number; y: number; r: number; a: number; speed: number; twinkle: number }[] = [];
    const nebula: { x: number; y: number; r: number; hue: number; a: number }[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      stars.length = 0;
      nebula.length = 0;
      for (let i = 0; i < 300; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2 + 0.2, a: Math.random(), speed: Math.random() * 0.2 + 0.05, twinkle: Math.random() * Math.PI * 2 });
      }
      for (let i = 0; i < 4; i++) {
        nebula.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 250 + 100, hue: [200, 240, 280, 190][i], a: Math.random() * 0.04 + 0.01 });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nebula.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `hsla(${n.hue},80%,60%,${n.a})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      stars.forEach(s => {
        s.twinkle += 0.012;
        const alpha = s.a * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,240,255,${alpha})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={ref} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />;
}