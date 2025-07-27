"use client"
import React, { useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";

// --- Simplex Noise Implementation ---
// This is a self-contained Simplex Noise implementation. It is used to generate
// the underlying "elevation" data for the contour map.
// It's defined outside the component to prevent re-creation on every render.
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

class SimplexNoise {
    constructor(random = Math.random) {
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            const r = Math.floor(random() * (i + 1));
            const t = this.p[i];
            this.p[i] = this.p[r];
            this.p[r] = t;
        }
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }

    noise2D(x, y) {
        // 2D Simplex noise implementation
        let n0, n1, n2;
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        let i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[this.perm[ii + this.perm[jj]] % 12], x0, y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[this.perm[ii + i1 + this.perm[jj + j1]] % 12], x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[this.perm[ii + 1 + this.perm[jj + 1]] % 12], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }
    
    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }
    
    grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
}

// The React component for the background
const TopographicBackground = () => {
    const canvasRef = useRef(null);
    const simplexRef = useRef(new SimplexNoise());
    const fieldRef = useRef([]);
    const mousePos = useRef({ x: -1000, y: -1000 });
    const animationProgress = useRef(0);
    const startTimeRef = useRef(null);
  

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const simplex = simplexRef.current;
        let animationFrameId;

        // --- Configuration ---
        const scale = 0.017;
        const speed = 0.00003;
        const lineDensity = 20;
        const lineWeight = 1.2;
        const baseLineColor = [30, 40, 49];
        const baseAlpha = 0.25;
        const resolution = 15;
        const introDuration = 5000;
        
        // --- Hover Effect Configuration ---
        const highlightRadius = 100;
        const highlightLineColor = 'rgb(200, 185, 185)';
        const highlightWeight = 2.0;

        const generateField = () => {
            const cols = Math.ceil(canvas.width / resolution) + 1;
            const rows = Math.ceil(canvas.height / resolution) + 1;
            fieldRef.current = Array.from({ length: cols }, (_, x) => 
                Array.from({ length: rows }, (_, y) => 
                    (simplex.noise2D(x * scale, y * scale) + 1) / 2
                )
            );
        };
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateField();
        };
        
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mousePos.current = { x: -1000, y: -1000 };
        };

        const draw = (time) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = time;
            }
            const elapsedTime = time - startTimeRef.current;
            
            // --- Intro Animation Logic ---
            if (elapsedTime < introDuration) {
                const t = elapsedTime / introDuration;
                animationProgress.current = 1 - Math.pow(1 - t, 3);
            } else {
                animationProgress.current = 1;
            }

            const currentLineDensity = lineDensity * animationProgress.current;
            const currentAlpha = baseAlpha * animationProgress.current;
            const lineColor = `rgba(${baseLineColor.join(',')}, ${currentAlpha})`;

            const animationOffset = time * speed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.imageSmoothingEnabled = true;

            const field = fieldRef.current;
            const cols = field.length;
            const rows = field[0].length;
            
            const highlightPath = new Path2D();

            // First Pass: Draw all base lines
            ctx.lineWidth = lineWeight;
            ctx.strokeStyle = lineColor;
            for (let i = 0; i < currentLineDensity; i++) {
                const baseThreshold = i / lineDensity;
                const threshold = (baseThreshold + animationOffset) % 1.0;
                
                ctx.beginPath();
                for (let x = 0; x < cols - 1; x++) {
                    for (let y = 0; y < rows - 1; y++) {
                        const cell_tl = { x: x * resolution, y: y * resolution };
                        const cell_tr = { x: (x + 1) * resolution, y: y * resolution };
                        const cell_br = { x: (x + 1) * resolution, y: (y + 1) * resolution };
                        const cell_bl = { x: x * resolution, y: (y + 1) * resolution };

                        const val_tl = field[x][y];
                        const val_tr = field[x + 1][y];
                        const val_br = field[x + 1][y + 1];
                        const val_bl = field[x][y + 1];

                        let state = 0;
                        if (val_tl > threshold) state |= 8;
                        if (val_tr > threshold) state |= 4;
                        if (val_br > threshold) state |= 2;
                        if (val_bl > threshold) state |= 1;

                        const lerp = (p1, p2, v1, v2) => {
                            if (Math.abs(v1 - v2) < 0.0001) return p1;
                            const t = (threshold - v1) / (v2 - v1);
                            return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
                        };

                        const p_t = lerp(cell_tl, cell_tr, val_tl, val_tr);
                        const p_r = lerp(cell_tr, cell_br, val_tr, val_br);
                        const p_b = lerp(cell_bl, cell_br, val_bl, val_br);
                        const p_l = lerp(cell_tl, cell_bl, val_tl, val_bl);

                        const checkAndAddHighlight = (p1, p2) => {
                            const midX = (p1.x + p2.x) / 2;
                            const midY = (p1.y + p2.y) / 2;
                            const dist = Math.sqrt(Math.pow(midX - mousePos.current.x, 2) + Math.pow(midY - mousePos.current.y, 2));
                            if(dist < highlightRadius) {
                                highlightPath.moveTo(p1.x, p1.y);
                                highlightPath.lineTo(p2.x, p2.y);
                            }
                        };

                        switch (state) {
                            case 1: case 14: ctx.moveTo(p_l.x, p_l.y); ctx.lineTo(p_b.x, p_b.y); checkAndAddHighlight(p_l, p_b); break;
                            case 2: case 13: ctx.moveTo(p_b.x, p_b.y); ctx.lineTo(p_r.x, p_r.y); checkAndAddHighlight(p_b, p_r); break;
                            case 3: case 12: ctx.moveTo(p_l.x, p_l.y); ctx.lineTo(p_r.x, p_r.y); checkAndAddHighlight(p_l, p_r); break;
                            case 4: case 11: ctx.moveTo(p_t.x, p_t.y); ctx.lineTo(p_r.x, p_r.y); checkAndAddHighlight(p_t, p_r); break;
                            case 5: case 10:
                                const center_avg = (val_tl + val_tr + val_br + val_bl) / 4;
                                if (center_avg > threshold) {
                                    ctx.moveTo(p_t.x, p_t.y); ctx.lineTo(p_r.x, p_r.y); checkAndAddHighlight(p_t, p_r);
                                    ctx.moveTo(p_l.x, p_l.y); ctx.lineTo(p_b.x, p_b.y); checkAndAddHighlight(p_l, p_b);
                                } else {
                                    ctx.moveTo(p_t.x, p_t.y); ctx.lineTo(p_l.x, p_l.y); checkAndAddHighlight(p_t, p_l);
                                    ctx.moveTo(p_b.x, p_b.y); ctx.lineTo(p_r.x, p_r.y); checkAndAddHighlight(p_b, p_r);
                                }
                                break;
                            case 6: case 9: ctx.moveTo(p_t.x, p_t.y); ctx.lineTo(p_b.x, p_b.y); checkAndAddHighlight(p_t, p_b); break;
                            case 7: case 8: ctx.moveTo(p_t.x, p_t.y); ctx.lineTo(p_l.x, p_l.y); checkAndAddHighlight(p_t, p_l); break;
                        }
                    }
                }
                ctx.stroke();
            }

            // Second Pass: Draw the highlighted segments on top
            if (mousePos.current.x > -1000) {
                ctx.lineWidth = highlightWeight;
                ctx.strokeStyle = highlightLineColor;
                ctx.stroke(highlightPath);
            }
            
            animationFrameId = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw(0);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
  
    return <canvas ref={canvasRef} style={{ position: 'relative', top: 0, left: 0, zIndex: -1, backgroundColor: '#948979' }} />;
};

// Main App Component
export default function HomeEnd() {
    const router = useRouter();



    
    return (
        <div className="relative h-full text-[#222222] overflow-hidden">
            
            <TopographicBackground />
            
            <div className="absolute z-10 top-0 left-0 p-2 md:p-3">
            <div className="h-13"></div>
                 <h1 className="text-[10vw] md:text-[6vw] lg:text-[5vw] font-thin text-[#222222] lowercase tracking-tighter leading-none select-none drop-shadow-lg">
                   THE <span className='text-[15vw] md:text-[8vw] lg:text-[6vw] font-bold font-serif italic'>art </span> i.e. <span className='text-[15vw] md:text-[8vw] lg:text-[6vw] font-thin font-serif italic'>nurture,</span><br></br><span className='text-[18vw] md:text-[10vw] lg:text-[8vw] font-black' >EXPERIENCE DESIGN.</span> 
                </h1>
            </div>

            <div className="absolute z-10 bottom-0 left-0 right-0 p-4 md:p-8 flex justify-between items-end">
                <div className="text-left">
                    <p className="text-2xl md:text-4xl lg:text-5xl text-[#222222] max-w-md drop-shadow-md px-1 mb-18 md:mb-8">
                       you have no idea what's possible.
                        
                    </p>
                </div>
                <div>
                    <button onClick={() => router.push('/services')}  className="px-2 py-1.5 bg-white text-black font-black mb-18 text-[9vw] md:text-[3vw] lg:text-[5vw] mb-4 md:mb-8 shadow-lg hover:bg-[#222222] hover:text-white focus:outline-none opacity-60 focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                       /services
                    </button>
                </div>
            </div>
        </div>
    );
}
