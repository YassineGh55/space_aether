import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const stars: { x: number; y: number; r: number; a: number; speed: number; twinkle: number }[] = [];
    const nebula: { x: number; y: number; r: number; hue: number; a: number; drift: number }[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      stars.length = 0;
      nebula.length = 0;
      const count = Math.min(400, Math.floor((canvas.width * canvas.height) / 4000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.15 + 0.03,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      for (let i = 0; i < 5; i++) {
        nebula.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.8,
          r: Math.random() * 300 + 120,
          hue: [195, 210, 240, 280, 185][i],
          a: Math.random() * 0.035 + 0.012,
          drift: (Math.random() - 0.5) * 0.08,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const horizon = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      horizon.addColorStop(0, "transparent");
      horizon.addColorStop(1, "rgba(6, 182, 212, 0.04)");
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nebula.forEach(n => {
        n.x += n.drift;
        if (n.x < -n.r) n.x = canvas.width + n.r;
        if (n.x > canvas.width + n.r) n.x = -n.r;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `hsla(${n.hue}, 85%, 58%, ${n.a})`);
        g.addColorStop(0.5, `hsla(${n.hue}, 70%, 40%, ${n.a * 0.3})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      stars.forEach(s => {
        s.twinkle += 0.01;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 235, 255, ${alpha})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true" />;
}
