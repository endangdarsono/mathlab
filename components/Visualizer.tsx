
import React, { useState, useRef, useEffect } from 'react';
import { Rotate3d, RefreshCcw } from 'lucide-react';
import { ShapeType, GeometryState } from '../types';

interface VisualizerProps {
  state: GeometryState;
}

const Visualizer: React.FC<VisualizerProps> = ({ state }) => {
  const [rotation, setRotation] = useState({ x: -20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const Label = ({ value, label, position }: { value: number; label?: string; position: string }) => (
    <div className={`absolute whitespace-nowrap bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] font-black text-gray-800 border border-gray-200 shadow-sm z-30 ${position}`}>
      {label && <span className="text-gray-400 mr-1 font-bold">{label}:</span>}
      {value.toFixed(1)} <span className="text-[9px] text-gray-400 uppercase">cm</span>
    </div>
  );

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;

    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const resetRotation = () => {
    setRotation({ x: -20, y: 20 });
  };

  const render2D = () => {
    // Increased scale for 2D shapes
    const scaleFactor = 12; 
    switch (state.type) {
      case ShapeType.SQUARE: {
        const sVal = state.dimensions.side || 0;
        const side = Math.min(sVal * scaleFactor, 240);
        return (
          <div className="relative flex items-center justify-center">
            <div className="bg-blue-500/10 border-4 border-blue-600 rounded-sm shadow-inner transition-all duration-300" style={{ width: `${side}px`, height: `${side}px` }} />
            <Label value={sVal} label="s" position="-bottom-10 left-1/2 -translate-x-1/2" />
            <Label value={sVal} label="s" position="-left-16 top-1/2 -translate-y-1/2" />
          </div>
        );
      }
      case ShapeType.RECTANGLE: {
        const wVal = state.dimensions.width || 0;
        const hVal = state.dimensions.height || 0;
        const w = Math.min(wVal * scaleFactor, 280);
        const h = Math.min(hVal * scaleFactor, 220);
        return (
          <div className="relative flex items-center justify-center">
            <div className="bg-green-500/10 border-4 border-green-600 rounded-sm shadow-inner transition-all duration-300" style={{ width: `${w}px`, height: `${h}px` }} />
            <Label value={wVal} label="p" position="-bottom-10 left-1/2 -translate-x-1/2" />
            <Label value={hVal} label="l" position="-left-16 top-1/2 -translate-y-1/2" />
          </div>
        );
      }
      case ShapeType.TRIANGLE: {
        const bVal = state.dimensions.base || 0;
        const hVal = state.dimensions.height || 0;
        const base = Math.min(bVal * scaleFactor, 280);
        const triH = Math.min(hVal * scaleFactor, 220);
        return (
          <div className="relative flex items-center justify-center">
            <svg width={base} height={triH} className="transition-all duration-300 overflow-visible drop-shadow-md">
              <polygon points={`0,${triH} ${base/2},0 ${base},${triH}`} className="fill-yellow-500/10 stroke-yellow-600 stroke-[4]" />
              <line x1={base/2} y1="0" x2={base/2} y2={triH} stroke="#d97706" strokeWidth="2" strokeDasharray="6" />
            </svg>
            <Label value={bVal} label="alas" position="-bottom-10 left-1/2 -translate-x-1/2" />
            <Label value={hVal} label="tinggi" position="top-1/2 left-1/2 -translate-x-[120%]" />
          </div>
        );
      }
      case ShapeType.CIRCLE: {
        const rVal = state.dimensions.radius || 0;
        const r = Math.min(rVal * scaleFactor, 120);
        return (
          <div className="relative flex items-center justify-center">
            <div className="bg-red-500/10 border-4 border-red-600 rounded-full transition-all duration-300 flex items-center justify-center shadow-inner" style={{ width: `${r * 2}px`, height: `${r * 2}px` }}>
              <div className="absolute w-[50%] h-[2px] bg-red-600 left-1/2 origin-left -translate-y-1/2" />
              <div className="absolute w-2 h-2 bg-red-600 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <Label value={rVal} label="r" position="top-1/2 right-[5%] -translate-y-1/2" />
          </div>
        );
      }
      default:
        // Render simple fallback for TRAPEZOID/PARALLELOGRAM if not explicitly increased
        return <div className="text-gray-300 font-bold uppercase text-xs">Visualisasi 2D Aktif</div>;
    }
  };

  const render3D = () => {
    const scale = 5.5; // Increased scale for 3D objects
    const transformStyle = { transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` };

    switch (state.type) {
      case ShapeType.CUBE: {
        const sVal = state.dimensions.side || 0;
        const s = Math.min(sVal * scale, 160);
        return (
          <div className="perspective-1000 relative">
            <div className="relative preserve-3d transition-transform duration-100" style={{ width: s, height: s, ...transformStyle }}>
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                <div key={face} style={{
                  position: 'absolute', width: `${s}px`, height: `${s}px`,
                  background: 'rgba(59, 130, 246, 0.2)', border: '2px solid rgba(59, 130, 246, 1)',
                  boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.3)',
                  transform: face === 'front' ? `translateZ(${s/2}px)` : face === 'back' ? `rotateY(180deg) translateZ(${s/2}px)` :
                             face === 'left' ? `rotateY(-90deg) translateZ(${s/2}px)` : face === 'right' ? `rotateY(90deg) translateZ(${s/2}px)` :
                             face === 'top' ? `rotateX(90deg) translateZ(${s/2}px)` : `rotateX(-90deg) translateZ(${s/2}px)`
                }} />
              ))}
            </div>
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2"><Label value={sVal} label="s" position="static" /></div>
          </div>
        );
      }
      case ShapeType.CUBOID: {
        const wVal = state.dimensions.width || 0;
        const hVal = state.dimensions.height || 0;
        const dVal = state.dimensions.depth || 0;
        const cw = Math.min(wVal * scale, 200);
        const ch = Math.min(hVal * scale, 160);
        const cd = Math.min(dVal * scale, 120);
        return (
          <div className="perspective-1000 relative">
            <div className="relative preserve-3d transition-transform duration-100" style={{ width: cw, height: ch, ...transformStyle }}>
              <div style={{ position: 'absolute', width: cw, height: ch, transform: `translateZ(${cd/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', boxShadow: 'inset 0 0 20px rgba(16,185,129,0.2)' }} />
              <div style={{ position: 'absolute', width: cw, height: ch, transform: `rotateY(180deg) translateZ(${cd/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
              <div style={{ position: 'absolute', width: cd, height: ch, transform: `rotateY(-90deg) translateZ(${cw/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
              <div style={{ position: 'absolute', width: cd, height: ch, transform: `rotateY(90deg) translateZ(${cw/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
              <div style={{ position: 'absolute', width: cw, height: cd, transform: `rotateX(90deg) translateZ(${ch/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
              <div style={{ position: 'absolute', width: cw, height: cd, transform: `rotateX(-90deg) translateZ(${ch/2}px)`, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
            </div>
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
               <Label value={wVal} label="p" position="static" />
               <Label value={hVal} label="l" position="static" />
               <Label value={dVal} label="t" position="static" />
            </div>
          </div>
        );
      }
      case ShapeType.SPHERE: {
        const rVal = state.dimensions.radius || 0;
        const sr = Math.min(rVal * scale, 100);
        return (
          <div className="perspective-1000 relative flex items-center justify-center">
            <div className="preserve-3d transition-transform duration-100" style={{ width: sr * 2, height: sr * 2, ...transformStyle }}>
              {/* The "Solid" Sphere Look */}
              <div className="absolute inset-0 rounded-full" style={{ 
                background: 'radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)', 
                boxShadow: 'inset -15px -15px 40px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.2)',
                transform: 'translateZ(1px)'
              }} />
              {/* Latitude Ring */}
              <div className="absolute inset-0 border border-white/30 rounded-full" style={{ transform: 'rotateX(90deg)' }} />
              {/* Longitude Ring */}
              <div className="absolute inset-0 border border-white/30 rounded-full" style={{ transform: 'rotateY(90deg)' }} />
            </div>
            <div className="absolute -right-24 top-1/2 -translate-y-1/2"><Label value={rVal} label="r" position="static" /></div>
          </div>
        );
      }
      case ShapeType.CYLINDER: {
        const rVal = state.dimensions.radius || 0;
        const hVal = state.dimensions.height || 0;
        const cr = Math.min(rVal * scale, 80);
        const cH = Math.min(hVal * scale, 180);
        return (
          <div className="perspective-1000 relative">
            <div className="relative preserve-3d transition-transform duration-100" style={{ width: cr * 2, height: cH, ...transformStyle }}>
              {/* Side (simplified wrapper) */}
              <div className="absolute top-0 left-0 bg-purple-500/30 border-x-2 border-purple-600" style={{ width: cr * 2, height: cH, transform: 'translateZ(0px)' }} />
              {/* Top Cap */}
              <div className="absolute rounded-full border-2 border-purple-600 bg-purple-400" style={{ 
                width: cr * 2, height: cr * 0.8, 
                transform: `translateY(-${cr * 0.4}px) rotateX(90deg)`,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
              }} />
              {/* Bottom Cap */}
              <div className="absolute rounded-full border-2 border-purple-600 bg-purple-600/80" style={{ 
                width: cr * 2, height: cr * 0.8, 
                transform: `translateY(${cH - cr * 0.4}px) rotateX(90deg)`,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }} />
            </div>
            <div className="absolute -right-28 top-1/2 -translate-y-1/2 space-y-2">
               <Label value={rVal} label="r" position="static" />
               <Label value={hVal} label="t" position="static" />
            </div>
          </div>
        );
      }
      case ShapeType.CONE: {
        const rVal = state.dimensions.radius || 0;
        const hVal = state.dimensions.height || 0;
        const cr = Math.min(rVal * scale, 80);
        const cH = Math.min(hVal * scale, 180);
        return (
          <div className="perspective-1000 relative">
            <div className="relative preserve-3d transition-transform duration-100" style={{ width: cr * 2, height: cH, ...transformStyle }}>
              {/* Alas (Base) */}
              <div className="absolute rounded-full border-2 border-pink-600 bg-pink-500/80" style={{ 
                width: cr * 2, height: cr * 0.8, 
                transform: `translateY(${cH - cr * 0.4}px) rotateX(90deg)`,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }} />
              {/* Tip to Base Lines (Simulated with SVG for accuracy) */}
              <svg className="absolute inset-0 overflow-visible" width={cr*2} height={cH}>
                <path d={`M 0 ${cH} L ${cr} 0 L ${cr*2} ${cH} Z`} className="fill-pink-500/20 stroke-pink-600 stroke-2" />
                <line x1={cr} y1="0" x2={cr} y2={cH} stroke="#db2777" strokeWidth="1" strokeDasharray="4" />
              </svg>
            </div>
            <div className="absolute -right-28 top-1/2 -translate-y-1/2 space-y-2">
               <Label value={hVal} label="t" position="static" />
               <Label value={rVal} label="r" position="static" />
            </div>
          </div>
        );
      }
      case ShapeType.PYRAMID: {
        const wVal = state.dimensions.width || 0;
        const hVal = state.dimensions.height || 0;
        const w = Math.min(wVal * scale, 150);
        const h = Math.min(hVal * scale, 180);
        return (
          <div className="perspective-1000 relative">
             <div className="relative preserve-3d transition-transform duration-100" style={{ width: w, height: h, ...transformStyle }}>
                <div style={{ position: 'absolute', width: w, height: w, background: 'rgba(99, 102, 241, 0.2)', border: '2px solid #6366f1', transform: `translateY(${h - w/2}px) rotateX(90deg)` }} />
                {[0, 90, 180, 270].map(deg => (
                   <div key={deg} style={{ 
                      position: 'absolute', width: 0, height: 0, 
                      borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderBottom: `${h}px solid rgba(99, 102, 241, 0.2)`,
                      transform: `rotateY(${deg}deg) translateZ(${w/2}px) rotateX(25deg)`, transformOrigin: 'bottom' 
                   }} />
                ))}
             </div>
             <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                <Label value={wVal} label="p" position="static" />
                <Label value={hVal} label="t" position="static" />
             </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const is3D = [ShapeType.CUBE, ShapeType.CUBOID, ShapeType.SPHERE, ShapeType.CYLINDER, ShapeType.CONE, ShapeType.PYRAMID].includes(state.type);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-[320px] md:h-[400px] flex items-center justify-center bg-white rounded-[2rem] border border-gray-100 overflow-hidden relative shadow-sm select-none transition-all ${is3D ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      onMouseDown={is3D ? handleMouseDown : undefined}
      onMouseMove={is3D ? handleMouseMove : undefined}
      onMouseUp={is3D ? handleMouseUp : undefined}
      onTouchStart={is3D ? handleMouseDown : undefined}
      onTouchMove={is3D ? handleMouseMove : undefined}
      onTouchEnd={is3D ? handleMouseUp : undefined}
    >
      <div className="absolute top-6 left-8 flex flex-col space-y-1">
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          Interactive Engine v3.5
        </div>
        {is3D && (
          <div className="flex items-center space-x-2 text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
            <Rotate3d size={10} />
            <span>DRAG TO ROTATE</span>
          </div>
        )}
      </div>

      {is3D && (
        <button 
          onClick={resetRotation}
          className="absolute top-6 right-8 p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
          title="Reset Sudut Pandang"
        >
          <RefreshCcw size={18} />
        </button>
      )}

      {/* Shapes Rendering Area */}
      <div className="transform transition-all duration-300 flex items-center justify-center p-8 w-full h-full">
        {is3D ? render3D() : render2D()}
      </div>

      {isDragging && is3D && (
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/20 rounded-[2rem] z-50" />
      )}
      
      {/* Background Decor */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50" />
    </div>
  );
};

export default Visualizer;
