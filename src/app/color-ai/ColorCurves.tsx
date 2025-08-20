

'use client';

import { useEffect, useId, useRef } from 'react';

type TonalPalette = {
    shadows: string | null;
    midtones: string | null;
    highlights: string | null;
};

interface ColorCurvesProps {
    tonalPalette: TonalPalette;
}

// Converts hex to an RGB object
function hexToRgb(hex: string | null) {
    if (!hex) return { r: 128, g: 128, b: 128 }; // Return neutral gray if hex is invalid
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
}

export function ColorCurves({ tonalPalette }: ColorCurvesProps) {
    const uniqueId = useId();
    const redGraphRef = useRef<SVGSVGElement>(null);
    const greenGraphRef = useRef<SVGSVGElement>(null);
    const blueGraphRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const colors = {
            shadows: hexToRgb(tonalPalette.shadows),
            midtones: hexToRgb(tonalPalette.midtones),
            highlights: hexToRgb(tonalPalette.highlights)
        };

        // Adjustment function to soften the curve points.
        function adjustToDiagonal(original: {r: number, g: number, b: number}, factor = 0.60) {
            return {
                r: Math.round(original.r + (128 - original.r) * factor),
                g: Math.round(original.g + (128 - original.g) * factor),
                b: Math.round(original.b + (128 - original.b) * factor)
            };
        }

        const adjustedColors = {
            shadows: adjustToDiagonal(colors.shadows),
            midtones: adjustToDiagonal(colors.midtones),
            highlights: adjustToDiagonal(colors.highlights)
        };
        
        function createCurvePath(shadowVal: number, midtoneVal: number, highlightVal: number) {
            const points = [
                { x: 0, y: 255 },
                { x: 64, y: 255 - shadowVal },
                { x: 128, y: 255 - midtoneVal },
                { x: 192, y: 255 - highlightVal },
                { x: 255, y: 0 }
            ];
    
            let path = `M ${points[0].x} ${points[0].y}`;
            const tension = 0.5; // Catmull-Rom tension
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i > 0 ? i - 1 : 0];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

                const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
                const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
                
                const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
                const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;
                
                path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`;
            }
            
            return path;
        }

        function addPoints(svg: SVGSVGElement, shadowVal: number, midtoneVal: number, highlightVal: number, color: string) {
            svg.querySelectorAll('.point').forEach(p => p.remove());

            const pointsData = [
                { x: 64, y: shadowVal },
                { x: 128, y: midtoneVal },
                { x: 192, y: highlightVal }
            ];

            pointsData.forEach(point => {
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("class", "point");
                dot.setAttribute("cx", String((point.x / 255) * 100) + "%");
                dot.setAttribute("cy", String(100 - (point.y / 255) * 100) + "%");
                dot.setAttribute("r", "3");
                dot.setAttribute("fill", "#222");
                dot.setAttribute("stroke", color);
                dot.setAttribute("stroke-width", "1.5");
                svg.appendChild(dot);
            });
        }

        function drawGraph(svgRef: React.RefObject<SVGSVGElement>, channelValues: { shadow: number, midtone: number, highlight: number }, color: string) {
            const svg = svgRef.current;
            if (!svg) return;

            const curvePath = createCurvePath(channelValues.shadow, channelValues.midtone, channelValues.highlight);
            const curveElement = svg.querySelector('path');
            if (curveElement) {
                curveElement.setAttribute('d', curvePath);
            }
            addPoints(svg, channelValues.shadow, channelValues.midtone, channelValues.highlight, color);
        }
        
        function drawAllGraphs() {
            if (!tonalPalette.shadows || !tonalPalette.midtones || !tonalPalette.highlights) return;
        
            if (redGraphRef.current) {
                const values = { shadow: adjustedColors.shadows.r, midtone: adjustedColors.midtones.r, highlight: adjustedColors.highlights.r };
                drawGraph(redGraphRef, values, '#ff4d4d');
            }
            if (greenGraphRef.current) {
                const values = { shadow: adjustedColors.shadows.g, midtone: adjustedColors.midtones.g, highlight: adjustedColors.highlights.g };
                drawGraph(greenGraphRef, values, '#4dff4d');
            }
            if (blueGraphRef.current) {
                const values = { shadow: adjustedColors.shadows.b, midtone: adjustedColors.midtones.b, highlight: adjustedColors.highlights.b };
                drawGraph(blueGraphRef, values, '#4d9dff');
            }
        }

        drawAllGraphs();
    }, [tonalPalette, uniqueId]);

    const Graph = ({ graphRef, color }: { graphRef: React.RefObject<SVGSVGElement>, color: string }) => (
      <div className="graph-container">
        <div className="graph">
          <svg ref={graphRef} className="w-full h-full" viewBox="0 0 255 255" preserveAspectRatio="none">
            <defs>
              <pattern id={`grid-${uniqueId}`} width="63.75" height="63.75" patternUnits="userSpaceOnUse">
                <path d="M 63.75 0 L 0 0 0 63.75" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="255" height="255" fill={`url(#grid-${uniqueId})`} />
            <line x1="0" y1="255" x2="255" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="3,3"/>
            <path d="" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    );

    return (
        <div className="grid grid-cols-3 gap-4">
            <Graph graphRef={redGraphRef} color="#ff4d4d" />
            <Graph graphRef={greenGraphRef} color="#4dff4d" />
            <Graph graphRef={blueGraphRef} color="#4d9dff" />
            <style jsx>{`
                .graph-container {
                    background: hsl(var(--card));
                    border-radius: 0.5rem;
                    padding: 1rem;
                    width: 100%;
                    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.05);
                }
                .graph {
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    position: relative;
                }
            `}</style>
        </div>
    );
}
