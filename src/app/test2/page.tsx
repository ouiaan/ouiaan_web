
'use client';

import { useEffect } from 'react';

export default function Test2Page() {
  useEffect(() => {
    // Converts hex to an RGB object
    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    const colors = {
        shadows: hexToRgb('#132227'),   // s: #132227
        midtones: hexToRgb('#9a948d'),  // m: #9a948d (Corrected from #cca57e)
        highlights: hexToRgb('#e7e4df') // h: #e7e4df
    };

    if (!colors.shadows || !colors.midtones || !colors.highlights) {
        console.error("Invalid hex color provided");
        return;
    }

    // Adjustment function to soften the curve points.
    // A higher factor means a more subtle effect (closer to the neutral diagonal).
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
    
    // Generates a smooth Cubic Bezier spline through all points.
    function createCurvePath(shadowVal: number, midtoneVal: number, highlightVal: number) {
        const points = [
            { x: 0, y: 255 },
            { x: 64, y: 255 - shadowVal },
            { x: 128, y: 255 - midtoneVal },
            { x: 192, y: 255 - highlightVal },
            { x: 255, y: 0 }
        ];

        let path = `M ${points[0].x} ${points[0].y}`;
        
        // Catmull-Rom to Cubic Bezier conversion logic
        const tension = 0.5; // Adjust this for more or less curve smoothness
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i > 0 ? i - 1 : 0];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

            const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
            const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
            
            const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
            const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;
            
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        
        return path;
    }


    function addPoints(graphId: string, shadowVal: number, midtoneVal: number, highlightVal: number, color: string) {
        const graph = document.getElementById(graphId);
        if (!graph) return;
        
        // Clear existing points before adding new ones
        graph.querySelectorAll('.point').forEach(p => p.remove());

        const points = [
            { x: 64, y: shadowVal },
            { x: 128, y: midtoneVal },
            { x: 192, y: highlightVal }
        ];

        points.forEach(point => {
            const dot = document.createElement('div');
            dot.className = 'point';
            dot.style.left = `${(point.x / 255) * 100}%`;
            dot.style.bottom = `${(point.y / 255) * 100}%`;
            dot.style.color = color;
            graph.appendChild(dot);
        });
    }

    function drawGraphs() {
        if (!colors.shadows || !colors.midtones || !colors.highlights) return;

        const redCurve = document.getElementById('red-curve');
        if (redCurve) {
            redCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.r, adjustedColors.midtones.r, adjustedColors.highlights.r));
            addPoints('red-graph', adjustedColors.shadows.r, adjustedColors.midtones.r, adjustedColors.highlights.r, '#ff4d4d');
        }

        const greenCurve = document.getElementById('green-curve');
        if (greenCurve) {
            greenCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.g, adjustedColors.midtones.g, adjustedColors.highlights.g));
            addPoints('green-graph', adjustedColors.shadows.g, adjustedColors.midtones.g, adjustedColors.highlights.g, '#4dff4d');
        }

        const blueCurve = document.getElementById('blue-curve');
        if (blueCurve) {
            blueCurve.setAttribute('d', createCurvePath(adjustedColors.shadows.b, adjustedColors.midtones.b, adjustedColors.highlights.b));
            addPoints('blue-graph', adjustedColors.shadows.b, adjustedColors.midtones.b, adjustedColors.highlights.b, '#4d9dff');
        }
    }

    drawGraphs();
  }, []);

  return (
    <>
      <style jsx global>{`
        .graph-page-container {
            font-family: Arial, sans-serif;
            background: #1a1a1a;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }
        .graph-container {
            background: #222;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 15px;
            width: 280px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .graph {
            width: 100%;
            height: 200px;
            position: relative;
            background: #222;
        }
        .grid {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(to right, #333 1px, transparent 1px),
                linear-gradient(to bottom, #333 1px, transparent 1px);
            background-size: 25% 33.33%;
            background-position: 0 0, 0 0;
        }
        .curve {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .point {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transform: translate(-50%, 50%);
            background: #222;
            border: 2px solid currentColor;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.5);
            z-index: 2;
        }
        .diagonal-line {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }
      `}</style>
      <div className="graph-page-container">
        {/* Red Graph */}
        <div className="graph-container">
            <div className="graph" id="red-graph">
                <div className="grid"></div>
                <svg className="diagonal-line" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line x1="0" y1="255" x2="255" y2="0" stroke="#444" strokeWidth="1"/>
                </svg>
                <svg className="curve" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="red-curve" d="" fill="none" stroke="#ff4d4d" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            </div>
        </div>

        {/* Green Graph */}
        <div className="graph-container">
            <div className="graph" id="green-graph">
                <div className="grid"></div>
                <svg className="diagonal-line" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line x1="0" y1="255" x2="255" y2="0" stroke="#444" strokeWidth="1"/>
                </svg>
                <svg className="curve" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="green-curve" d="" fill="none" stroke="#4dff4d" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            </div>
        </div>

        {/* Blue Graph */}
        <div className="graph-container">
            <div className="graph" id="blue-graph">
                <div className="grid"></div>
                <svg className="diagonal-line" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line x1="0" y1="255" x2="255" y2="0" stroke="#444" strokeWidth="1"/>
                </svg>
                <svg className="curve" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="blue-curve" d="" fill="none" stroke="#4d9dff" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
      </div>
    </>
  );
}

    