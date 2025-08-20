

'use client';

import { useMemo } from 'react';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { cn } from '@/lib/utils';

// Converts hex to an RGB object
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// This function creates a smooth curve path based on the color points for a single channel.
function createCurvePath(shadowVal: number, midtoneVal: number, highlightVal: number): string {
    const points = [
        { x: 0,   y: 255 - 0 }, // Inverted Y for SVG coords - BLACK
        { x: 64,  y: 255 - shadowVal },
        { x: 128, y: 255 - midtoneVal },
        { x: 192, y: 255 - highlightVal },
        { x: 255, y: 255 - 255 } // WHITE
    ];

    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    
    return path;
}


interface RgbCurveDisplayProps {
    colors: {
        shadows: string | null;
        midtones: string | null;
        highlights: string | null;
    }
}

function RgbCurveDisplay({ colors }: RgbCurveDisplayProps) {

    const rgbValues = useMemo(() => {
        if (!colors.shadows || !colors.midtones || !colors.highlights) return null;
        const shadows = hexToRgb(colors.shadows);
        const midtones = hexToRgb(colors.midtones);
        const highlights = hexToRgb(colors.highlights);

        if (!shadows || !midtones || !highlights) return null;

        return { shadows, midtones, highlights };
    }, [colors]);

    const redPath = useMemo(() => {
        if (!rgbValues) return "M 0,255 L 255,0";
        return createCurvePath(rgbValues.shadows.r, rgbValues.midtones.r, rgbValues.highlights.r);
    }, [rgbValues]);
    
    const greenPath = useMemo(() => {
        if (!rgbValues) return "M 0,255 L 255,0";
        return createCurvePath(rgbValues.shadows.g, rgbValues.midtones.g, rgbValues.highlights.g);
    }, [rgbValues]);

    const bluePath = useMemo(() => {
        if (!rgbValues) return "M 0,255 L 255,0";
        return createCurvePath(rgbValues.shadows.b, rgbValues.midtones.b, rgbValues.highlights.b);
    }, [rgbValues]);

    const renderCurve = (path: string, color: string) => (
        <BackgroundGradient animate={true} containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground p-4 flex flex-col items-center gap-2">
            <div className="w-full aspect-square relative bg-[#202020] rounded-md overflow-hidden">
                {/* Grid */}
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="grid" width="25%" height="25%" patternUnits="userSpaceOnUse">
                            <path d="M 25% 0 L 25% 100% M 0 25% L 100% 25%" fill="none" stroke="#383838" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                {/* Diagonal Line and Curve */}
                <svg className="absolute inset-0" viewBox="0 0 255 255" preserveAspectRatio="none">
                    <line x1="0" y1="255" x2="255" y2="0" stroke="#555" strokeWidth="1.5"/>
                    <path d={path} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                </svg>
            </div>
        </BackgroundGradient>
    );

    if (!rgbValues) {
        return (
            <>
                <div className="rounded-2xl bg-card text-card-foreground p-4 flex flex-col items-center gap-2 aspect-square justify-center text-muted-foreground">No color data</div>
                <div className="rounded-2xl bg-card text-card-foreground p-4 flex flex-col items-center gap-2 aspect-square justify-center text-muted-foreground">No color data</div>
                <div className="rounded-2xl bg-card text-card-foreground p-4 flex flex-col items-center gap-2 aspect-square justify-center text-muted-foreground">No color data</div>
            </>
        )
    }

    return (
        <>
            {renderCurve(redPath, '#ff4d4d')}
            {renderCurve(greenPath, '#4dff4d')}
            {renderCurve(bluePath, '#4d9dff')}
        </>
    );
}


export default function Test2Page() {
    // These values simulate the input from the eyedroppers.
    // The logic is now prepared to handle them dynamically.
    const sampleColors = {
        shadows: '#2B2827',
        midtones: '#8A8784',
        highlights: '#E8E1D3'
    };

    return (
        <div className="container mx-auto py-16 md:py-24 px-4">
             <h3 className="font-headline text-3xl mb-6 text-center">RGB Curves</h3>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                <RgbCurveDisplay colors={sampleColors} />
            </div>
        </div>
    );
}
