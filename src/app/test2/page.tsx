

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

    // Values selected from the "Dog" photo
    const colors = {
        shadows: hexToRgb('#343A34'),   // Dark, desaturated green
        midtones: hexToRgb('#BFAE9C'),  // Muted, warm beige
        highlights: hexToRgb('#DEDCD7') // Soft, off-white
    };

    if (!colors.shadows || !colors.midtones || !colors.highlights) {
        console.error("Invalid hex color provided");
        return;
    }

    // This function maps an input value (0-255) to an output value based on the color curve.
    // It uses Catmull-Rom interpolation to create a smooth curve.
    function createCurve(shadowVal: number, midtoneVal: number, highlightVal: number) {
        // Control points for the curve.
        // Input values (X-axis) are fixed at 0, 64, 128, 192, 255.
        // Output values (Y-axis) are based on the selected colors.
        const points = [
            { x: 0,   y: 0 },
            { x: 64,  y: shadowVal },
            { x: 128, y: midtoneVal },
            { x: 192, y: highlightVal },
            { x: 255, y: 255 }
        ];

        let path = `M ${points[0].x},${255 - points[0].y}`;
        
        // Use Catmull-Rom to Cubic Bezier conversion logic for a smooth path
        const tension = 0; // Use 0 for a standard Catmull-Rom spline, which passes through all points.
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i > 0 ? i - 1 : i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

            const cp1x = p1.x + (p2.x - p0.x) / 6 * (1 - tension);
            const cp1y = 255 - (p1.y + (p2.y - p0.y) / 6 * (1 - tension));
            
            const cp2x = p2.x - (p3.x - p1.x) / 6 * (1 - tension);
            const cp2y = 255 - (p2.y - (p3.y - p1.y) / 6 * (1 - tension));
            
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${255 - p2.y}`;
        }
        
        return path;
    }

    function addPoints(graphId: string, shadowVal: number, midtoneVal: number, highlightVal: number, color: string) {
        const graph = document.getElementById(graphId);
        if (!graph) return;
        
        graph.querySelectorAll('.point').forEach(p => p.remove());

        const points = [
            { x: 64,  y: shadowVal },
            { x: 128, y: midtoneVal },
            { x: 192, y: highlightVal }
        ];

        points.forEach(point => {
            const dot = document.createElement('div');
            dot.className = 'point';
            // Correctly map X and Y to left and bottom
            dot.style.left = `${(point.x / 255) * 100}%`;
            dot.style.bottom = `${(point.y / 255) * 100}%`; // Direct mapping, no inversion
            dot.style.color = color;
            graph.appendChild(dot);
        });
    }

    function drawGraphs() {
        if (!colors.shadows || !colors.midtones || !colors.highlights) return;

        // Correctly pass the RGB values to the curve and point functions.
        const { shadows, midtones, highlights } = colors;

        const redCurve = document.getElementById('red-curve');
        if (redCurve) {
            redCurve.setAttribute('d', createCurve(shadows.r, midtones.r, highlights.r));
            addPoints('red-graph', shadows.r, midtones.r, highlights.r, '#ff4d4d');
        }

        const greenCurve = document.getElementById('green-curve');
        if (greenCurve) {
            greenCurve.setAttribute('d', createCurve(shadows.g, midtones.g, highlights.g));
            addPoints('green-graph', shadows.g, midtones.g, highlights.g, '#4dff4d');
        }

        const blueCurve = document.getElementById('blue-curve');
        if (blueCurve) {
            blueCurve.setAttribute('d', createCurve(shadows.b, midtones.b, highlights.b));
            addPoints('blue-graph', shadows.b, midtones.b, highlights.b, '#4d9dff');
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
            color: #f0f0f0;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            gap: 15px;
        }
        .graph-container {
            background: #282828;
            border-radius: 8px;
            padding: 20px;
            width: 300px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            border: 1px solid #333;
        }
        .graph-title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        .graph {
            width: 100%;
            padding-bottom: 100%; /* Create a square aspect ratio */
            position: relative;
            background: #202020;
            border-radius: 4px;
        }
        .grid {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(to right, #383838 1px, transparent 1px),
                linear-gradient(to bottom, #383838 1px, transparent 1px);
            background-size: 25% 25%;
        }
        .curve-svg, .diagonal-line-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .point {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            transform: translate(-50%, 50%); /* Center the point on the coordinate */
            background: #282828;
            border: 2px solid currentColor;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.5);
            z-index: 2;
        }
        .diagonal-line {
            stroke: #555;
            stroke-width: 1.5;
        }
        .color-curve {
            fill: none;
            stroke-width: 2.2;
            stroke-linecap: round;
        }
      `}</style>
      <div className="graph-page-container">
        {/* Red Graph */}
        <div className="graph-container">
            <h3 className="graph-title" style={{ color: '#ff4d4d' }}>Red Channel</h3>
            <div className="graph" id="red-graph">
                <div className="grid"></div>
                <svg className="diagonal-line-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line className="diagonal-line" x1="0" y1="255" x2="255" y2="0"/>
                </svg>
                <svg className="curve-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="red-curve" className="color-curve" d="" stroke="#ff4d4d"/>
                </svg>
            </div>
        </div>

        {/* Green Graph */}
        <div className="graph-container">
            <h3 className="graph-title" style={{ color: '#4dff4d' }}>Green Channel</h3>
            <div className="graph" id="green-graph">
                <div className="grid"></div>
                <svg className="diagonal-line-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line className="diagonal-line" x1="0" y1="255" x2="255" y2="0"/>
                </svg>
                <svg className="curve-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="green-curve" className="color-curve" d="" stroke="#4dff4d"/>
                </svg>
            </div>
        </div>

        {/* Blue Graph */}
        <div className="graph-container">
            <h3 className="graph-title" style={{ color: '#4d9dff' }}>Blue Channel</h3>
            <div className="graph" id="blue-graph">
                <div className="grid"></div>
                <svg className="diagonal-line-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line className="diagonal-line" x1="0" y1="255" x2="255" y2="0"/>
                </svg>
                <svg className="curve-svg" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <path id="blue-curve" className="color-curve" d="" stroke="#4d9dff"/>
                </svg>
            </div>
        </div>
      </div>
    </>
  );
}

    