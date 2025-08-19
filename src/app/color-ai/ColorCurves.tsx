
'use client';

import { useEffect, useId } from 'react';

type TonalPalette = {
    shadows: { color: string };
    midtones: { color: string };
    highlights: { color: string };
};

interface ColorCurvesProps {
    tonalPalette: TonalPalette;
}

// Converts hex to an RGB object
function hexToRgb(hex: string) {
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

    useEffect(() => {
        const colors = {
            shadows: hexToRgb(tonalPalette.shadows.color),
            midtones: hexToRgb(tonalPalette.midtones.color),
            highlights: hexToRgb(tonalPalette.highlights.color)
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

        function addPoints(graphId: string, shadowVal: number, midtoneVal: number, highlightVal: number, color: string) {
            const graph = document.getElementById(graphId);
            if (!graph) return;
            
            graph.querySelectorAll('.point').forEach(p => p.remove());

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
                
                const svg = graph.querySelector('svg.curve');
                if (svg) {
                    svg.appendChild(dot);
                }
            });
        }

        function drawGraphs() {
            if (!colors.shadows || !colors.midtones || !colors.highlights) return;

            const redCurve = document.getElementById(`red-curve-${uniqueId}`);
            if (redCurve) {
                redCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.r, adjustedColors.midtones.r, adjustedColors.highlights.r));
                addPoints(`red-graph-${uniqueId}`, adjustedColors.shadows.r, adjustedColors.midtones.r, adjustedColors.highlights.r, '#ff4d4d');
            }

            const greenCurve = document.getElementById(`green-curve-${uniqueId}`);
            if (greenCurve) {
                greenCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.g, adjustedColors.midtones.g, adjustedColors.highlights.g));
                addPoints(`green-graph-${uniqueId}`, adjustedColors.shadows.g, adjustedColors.midtones.g, adjustedColors.highlights.g, '#4dff4d');
            }

            const blueCurve = document.getElementById(`blue-curve-${uniqueId}`);
            if (blueCurve) {
                blueCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.b, adjustedColors.midtones.b, adjustedColors.highlights.b));
                addPoints(`blue-graph-${uniqueId}`, adjustedColors.shadows.b, adjustedColors.midtones.b, adjustedColors.highlights.b, '#4d9dff');
            }
        }

        drawGraphs();
    }, [tonalPalette, uniqueId]);

    const Graph = ({ id, curveColor }: { id: string, curveColor: string }) => (
        <div className="bg-card border border-border/50 rounded-lg p-4 shadow-inner">
            <div id={id} className="relative w-full aspect-square">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <path d="M 0 25 H 100 M 0 50 H 100 M 0 75 H 100 M 25 0 V 100 M 50 0 V 100 M 75 0 V 100" stroke="hsl(var(--border))" strokeWidth="0.2" />
                    {/* Diagonal Line */}
                    <line x1="0" y1="100" x2="100" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" strokeDasharray="2,2"/>
                    {/* Curve */}
                    <path id={`curve-${id}`} d="" fill="none" stroke={curveColor} strokeWidth="1" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-3 gap-4">
             <div className="graph-container">
                <div className="graph" id={`red-graph-${uniqueId}`}>
                    <svg className="w-full h-full" viewBox="0 0 255 255" preserveAspectRatio="none">
                        <defs>
                            <pattern id={`grid-${uniqueId}`} width="63.75" height="63.75" patternUnits="userSpaceOnUse">
                                <path d="M 63.75 0 L 0 0 0 63.75" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="255" height="255" fill={`url(#grid-${uniqueId})`} />
                        <line x1="0" y1="255" x2="255" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="3,3"/>
                        <path id={`red-curve-${uniqueId}`} d="" fill="none" stroke="#ff4d4d" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>

            <div className="graph-container">
                <div className="graph" id={`green-graph-${uniqueId}`}>
                     <svg className="w-full h-full" viewBox="0 0 255 255" preserveAspectRatio="none">
                        <rect width="255" height="255" fill={`url(#grid-${uniqueId})`} />
                        <line x1="0" y1="255" x2="255" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="3,3"/>
                        <path id={`green-curve-${uniqueId}`} d="" fill="none" stroke="#4dff4d" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>

            <div className="graph-container">
                <div className="graph" id={`blue-graph-${uniqueId}`}>
                     <svg className="w-full h-full" viewBox="0 0 255 255" preserveAspectRatio="none">
                        <rect width="255" height="255" fill={`url(#grid-${uniqueId})`} />
                        <line x1="0" y1="255" x2="255" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="3,3"/>
                        <path id={`blue-curve-${uniqueId}`} d="" fill="none" stroke="#4d9dff" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>

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
                .point {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    background: #222;
                    border: 2px solid currentColor;
                    z-index: 2;
                }
            `}</style>
        </div>
    );
}
