import { useEffect, useRef, useMemo } from "react";
import { Delaunay } from "d3-delaunay";
import { TimeOfDay } from "@/types/map";

interface HeatMapCanvasProps {
  timeOfDay: TimeOfDay;
}

export const HeatMapCanvas = ({ timeOfDay }: HeatMapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate stable seed points (memoized so they don't change on re-render)
  const seedPoints = useMemo(() => {
    const points: [number, number][] = [];
    
    // Create a grid with jitter for organic distribution
    const cols = 7;
    const rows = 5;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Base position + random jitter
        const x = (i / cols + Math.random() * 0.12) * 100;
        const y = (j / rows + Math.random() * 0.15) * 100;
        points.push([x, y]);
      }
    }
    return points;
  }, []);

  // Assign colors based on day/night percentages
  const cellColors = useMemo(() => {
    const numCells = seedPoints.length;
    const colors: string[] = [];
    
    // Read status colours from the design tokens so the overlay follows the theme.
    const css = getComputedStyle(document.documentElement);
    const tone = (name: string, alpha: number) => `hsl(${css.getPropertyValue(`--${name}`).trim()} / ${alpha})`;
    const safe = tone("success", 0.32);
    const caution = tone("warning", 0.36);
    const danger = tone("destructive", 0.42);

    if (timeOfDay === "day") {
      // Day: 80% green, 20% yellow
      const yellowCount = Math.floor(numCells * 0.20);
      const greenCount = numCells - yellowCount;
      
      for (let i = 0; i < greenCount; i++) colors.push(safe);
      for (let i = 0; i < yellowCount; i++) colors.push(caution);
    } else {
      // Night: 80% green, 15% yellow, 5% red
      const redCount = Math.floor(numCells * 0.05);
      const yellowCount = Math.floor(numCells * 0.15);
      const greenCount = numCells - yellowCount - redCount;
      
      for (let i = 0; i < greenCount; i++) colors.push(safe);
      for (let i = 0; i < yellowCount; i++) colors.push(caution);
      for (let i = 0; i < redCount; i++) colors.push(danger);
    }
    
    // Shuffle colors for random distribution
    return colors.sort(() => Math.random() - 0.5);
  }, [seedPoints.length, timeOfDay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Convert percentage points to actual coordinates
    const scaledPoints: [number, number][] = seedPoints.map(([x, y]) => [
      (x / 100) * canvas.width,
      (y / 100) * canvas.height,
    ]);

    // Generate Voronoi diagram
    const delaunay = Delaunay.from(scaledPoints);
    const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);

    const css = getComputedStyle(document.documentElement);
    const tone = (name: string, alpha: number) => `hsl(${css.getPropertyValue(`--${name}`).trim()} / ${alpha})`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each Voronoi cell
    for (let i = 0; i < seedPoints.length; i++) {
      const cell = voronoi.cellPolygon(i);
      if (!cell) continue;

      // Draw filled polygon
      ctx.beginPath();
      ctx.moveTo(cell[0][0], cell[0][1]);
      for (let j = 1; j < cell.length; j++) {
        ctx.lineTo(cell[j][0], cell[j][1]);
      }
      ctx.closePath();
      
      ctx.fillStyle = cellColors[i];
      ctx.fill();
      
      // Hairline cell border in the card colour
      ctx.strokeStyle = tone("card", 0.55);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [seedPoints, cellColors, timeOfDay]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
    />
  );
};
