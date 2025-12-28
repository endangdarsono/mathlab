
import React, { useState, useMemo, useEffect } from 'react';
import { Zap, Clock, MapPin, Gauge, Play, RotateCcw, Info, ArrowRight, Lightbulb, Settings2 } from 'lucide-react';

type MotionVariable = 'J' | 'K' | 'W';
type UnitSystem = 'km-h' | 'm-s';

const MotionLab: React.FC = () => {
  const [calculatingFor, setCalculatingFor] = useState<MotionVariable>('J');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('km-h');
  
  // Default values based on unit system
  const [distance, setDistance] = useState<number>(100);
  const [speed, setSpeed] = useState<number>(50);
  const [time, setTime] = useState<number>(2);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);

  // Labels based on unit system
  const units = useMemo(() => {
    return unitSystem === 'km-h' 
      ? { distance: 'KM', speed: 'KM/JAM', time: 'JAM' }
      : { distance: 'METER', speed: 'M/DETIK', time: 'DETIK' };
  }, [unitSystem]);

  // Reset values when unit system changes to provide sensible defaults
  useEffect(() => {
    if (unitSystem === 'km-h') {
      setDistance(100);
      setSpeed(50);
      setTime(2);
    } else {
      setDistance(10);
      setSpeed(2);
      setTime(5);
    }
    setAnimProgress(0);
    setIsAnimating(false);
  }, [unitSystem]);

  // Perhitungan otomatis saat input berubah
  useEffect(() => {
    if (isAnimating) return;

    if (calculatingFor === 'J') {
      setDistance(speed * time);
    } else if (calculatingFor === 'K') {
      setSpeed(time !== 0 ? distance / time : 0);
    } else if (calculatingFor === 'W') {
      setTime(speed !== 0 ? distance / speed : 0);
    }
  }, [distance, speed, time, calculatingFor, isAnimating]);

  // Simulasi Animasi
  useEffect(() => {
    let interval: any;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimProgress(prev => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }
          // Kecepatan animasi disesuaikan. Kita buat sedikit normalisasi agar m/s tidak terlalu lambat/cepat dibanding km/h secara visual
          const visualFactor = unitSystem === 'km-h' ? 0.5 : 2;
          return prev + (speed / 100) * visualFactor + 0.2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating, speed, unitSystem]);

  const resetAnim = () => {
    setIsAnimating(false);
    setAnimProgress(0);
  };

  const startAnim = () => {
    setAnimProgress(0);
    setIsAnimating(true);
  };

  const formulaInfo = useMemo(() => {
    switch (calculatingFor) {
      case 'J': return { label: 'Jarak', icon: MapPin, formula: 'J = K × W', desc: 'Jarak adalah seberapa jauh benda berpindah.' };
      case 'K': return { label: 'Kecepatan', icon: Gauge, formula: 'K = J ÷ W', desc: 'Kecepatan adalah seberapa cepat benda bergerak.' };
      case 'W': return { label: 'Waktu', icon: Clock, formula: 'W = J ÷ K', desc: 'Waktu adalah durasi perjalanan benda.' };
    }
  }, [calculatingFor]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Simulation Area */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 left-6 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isAnimating ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Live Motion Simulator v1.1</span>
        </div>

        {/* The Track */}
        <div className="relative h-40 mt-12 mb-4 border-b-4 border-dashed border-slate-700 flex items-end pb-2">
          {/* Start/Finish Labels */}
          <div className="absolute left-0 -bottom-8 text-[10px] font-bold text-slate-500">MULAI (0 {units.distance.toLowerCase()})</div>
          <div className="absolute right-0 -bottom-8 text-[10px] font-bold text-slate-500 text-right">FINISH ({distance.toFixed(1)} {units.distance.toLowerCase()})</div>

          {/* Vehicle */}
          <div 
            className="absolute transition-all duration-100 ease-linear"
            style={{ left: `${animProgress}%`, transform: 'translateX(-50%)' }}
          >
            <div className="relative group">
              <div className="bg-red-600 p-3 rounded-xl shadow-lg shadow-red-900/40 relative z-10">
                <Zap className="text-white fill-white" size={24} />
              </div>
              {/* Speed lines */}
              {isAnimating && (
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 space-y-1">
                  <div className="w-6 h-0.5 bg-red-500/50 rounded-full animate-pulse" />
                  <div className="w-4 h-0.5 bg-red-400/30 rounded-full animate-pulse delay-75" />
                  <div className="w-5 h-0.5 bg-red-500/50 rounded-full animate-pulse delay-150" />
                </div>
              )}
              {/* Badge info above vehicle */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded text-[9px] font-bold text-slate-900 shadow-sm whitespace-nowrap">
                {((animProgress/100) * distance).toFixed(1)} {units.distance.toLowerCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
              <p className="text-sm font-bold text-white">{isAnimating ? 'Bergerak...' : 'Siap'}</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Waktu Berjalan</p>
              <p className="text-sm font-bold text-white font-mono">{( (animProgress/100) * time ).toFixed(2)} {units.time.toLowerCase()}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={resetAnim}
              className="p-3 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={startAnim}
              disabled={isAnimating}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
            >
              <Play size={20} fill="currentColor" />
              <span>Mulai Simulasi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Formula Triangle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Pilih Satuan</h3>
                <Settings2 size={16} className="text-gray-300" />
             </div>
             <div className="grid grid-cols-2 gap-2 mb-8">
                <button 
                  onClick={() => setUnitSystem('km-h')}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${unitSystem === 'km-h' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                >
                  KM & Jam
                </button>
                <button 
                  onClick={() => setUnitSystem('m-s')}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${unitSystem === 'm-s' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                >
                  Meter & Detik
                </button>
             </div>

            <div className="relative w-full aspect-video mb-4 flex items-center justify-center">
              <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl max-w-[200px]">
                <path 
                  d="M 50 5 L 95 75 L 5 75 Z" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="1" 
                />
                
                {/* Jarak (Top) */}
                <g 
                  onClick={() => setCalculatingFor('J')}
                  className={`cursor-pointer transition-all duration-300 group ${calculatingFor === 'J' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <path d="M 50 8 L 70 40 L 30 40 Z" fill="#ef4444" />
                  <text x="50" y="32" textAnchor="middle" fill="white" className="text-[12px] font-black pointer-events-none">J</text>
                </g>

                {/* Kecepatan (Bottom Left) */}
                <g 
                  onClick={() => setCalculatingFor('K')}
                  className={`cursor-pointer transition-all duration-300 group ${calculatingFor === 'K' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <path d="M 12 72 L 48 72 L 48 44 L 32 44 Z" fill="#3b82f6" />
                  <text x="30" y="63" textAnchor="middle" fill="white" className="text-[12px] font-black pointer-events-none">K</text>
                </g>

                {/* Waktu (Bottom Right) */}
                <g 
                  onClick={() => setCalculatingFor('W')}
                  className={`cursor-pointer transition-all duration-300 group ${calculatingFor === 'W' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <path d="M 88 72 L 52 72 L 52 44 L 68 44 Z" fill="#22c55e" />
                  <text x="70" y="63" textAnchor="middle" fill="white" className="text-[12px] font-black pointer-events-none">W</text>
                </g>
              </svg>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Mencari</p>
              <p className="text-lg font-black text-slate-800">{formulaInfo?.label}</p>
              <div className="text-xl font-mono font-black text-red-600 mt-2">{formulaInfo?.formula}</div>
            </div>
          </div>

          <div className="bg-red-600 p-6 rounded-3xl text-white shadow-xl">
             <h4 className="font-bold flex items-center mb-3">
              <Lightbulb size={18} className="mr-2" />
              Ingat Ini!
            </h4>
            <ul className="text-sm space-y-2 text-red-100">
              <li className="flex items-start">
                <ArrowRight size={14} className="mt-1 mr-2 flex-shrink-0" />
                <span>Tutupi huruf yang dicari pada segitiga untuk melihat rumusnya.</span>
              </li>
              <li className="flex items-start">
                <ArrowRight size={14} className="mt-1 mr-2 flex-shrink-0" />
                <span>Huruf berdampingan berarti <strong>kali</strong> (K × W).</span>
              </li>
              <li className="flex items-start">
                <ArrowRight size={14} className="mt-1 mr-2 flex-shrink-0" />
                <span>Huruf atas-bawah berarti <strong>bagi</strong> (J ÷ K atau J ÷ W).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Inputs & Result */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center">
              <Zap className="mr-2 text-red-600" />
              Input Parameter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Jarak Input */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${calculatingFor === 'J' ? 'bg-red-50 border-red-500 ring-4 ring-red-500/10' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className={calculatingFor === 'J' ? 'text-red-500' : 'text-gray-400'} size={20} />
                  <span className="text-xs font-black uppercase text-gray-500">Jarak (J)</span>
                </div>
                <input 
                  type="number" 
                  value={distance} 
                  disabled={calculatingFor === 'J'}
                  onChange={e => setDistance(parseFloat(e.target.value) || 0)}
                  className={`w-full bg-transparent text-2xl font-black outline-none ${calculatingFor === 'J' ? 'text-red-700' : 'text-gray-800'}`}
                />
                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{units.distance}</div>
              </div>

              {/* Kecepatan Input */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${calculatingFor === 'K' ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/10' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Gauge className={calculatingFor === 'K' ? 'text-blue-500' : 'text-gray-400'} size={20} />
                  <span className="text-xs font-black uppercase text-gray-500">Kecepatan (K)</span>
                </div>
                <input 
                  type="number" 
                  value={speed} 
                  disabled={calculatingFor === 'K'}
                  onChange={e => setSpeed(parseFloat(e.target.value) || 0)}
                  className={`w-full bg-transparent text-2xl font-black outline-none ${calculatingFor === 'K' ? 'text-blue-700' : 'text-gray-800'}`}
                />
                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{units.speed}</div>
              </div>

              {/* Waktu Input */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${calculatingFor === 'W' ? 'bg-green-50 border-green-500 ring-4 ring-green-500/10' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className={calculatingFor === 'W' ? 'text-green-500' : 'text-gray-400'} size={20} />
                  <span className="text-xs font-black uppercase text-gray-500">Waktu (W)</span>
                </div>
                <input 
                  type="number" 
                  value={time} 
                  disabled={calculatingFor === 'W'}
                  onChange={e => setTime(parseFloat(e.target.value) || 0)}
                  className={`w-full bg-transparent text-2xl font-black outline-none ${calculatingFor === 'W' ? 'text-green-700' : 'text-gray-800'}`}
                />
                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{units.time}</div>
              </div>
            </div>

            {/* Analysis Box */}
            <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-400 uppercase mb-6 flex items-center">
                <Info size={16} className="mr-2" />
                Analisis Perhitungan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <p className="text-xs text-slate-500 mb-2">Langkah Penyelesaian:</p>
                   <div className="text-lg font-mono font-bold text-slate-700 space-y-2">
                     {calculatingFor === 'J' && <div>J = {speed.toFixed(1)} {units.speed.toLowerCase()} × {time.toFixed(1)} {units.time.toLowerCase()}</div>}
                     {calculatingFor === 'K' && <div>K = {distance.toFixed(1)} {units.distance.toLowerCase()} ÷ {time.toFixed(1)} {units.time.toLowerCase()}</div>}
                     {calculatingFor === 'W' && <div>W = {distance.toFixed(1)} {units.distance.toLowerCase()} ÷ {speed.toFixed(1)} {units.speed.toLowerCase()}</div>}
                     <div className="w-12 h-1 bg-red-600 rounded-full" />
                     <div className="text-3xl text-red-600">
                       = {calculatingFor === 'J' ? distance.toFixed(1) : calculatingFor === 'K' ? speed.toFixed(1) : time.toFixed(2)} 
                       <span className="text-sm ml-2 text-slate-400 lowercase">
                         {calculatingFor === 'J' ? units.distance : calculatingFor === 'K' ? units.speed : units.time}
                       </span>
                     </div>
                   </div>
                </div>
                <div className="flex flex-col justify-center border-l border-slate-200 pl-8">
                  <p className="text-sm font-medium text-slate-600 italic">
                    "{formulaInfo?.desc}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionLab;
