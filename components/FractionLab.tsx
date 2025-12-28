
import React, { useState, useMemo, useEffect } from 'react';
import { Divide, Percent, CircleDot, Info, RefreshCw, Layers, ArrowRightLeft } from 'lucide-react';

const FractionLab: React.FC = () => {
  const [num, setNum] = useState<number>(1);
  const [den, setDen] = useState<number>(2);
  
  const [decimalInput, setDecimalInput] = useState<string>("0.5");
  const [percentInput, setPercentInput] = useState<string>("50");
  const [mixedInput, setMixedInput] = useState({ whole: 0, num: 1, den: 2 });

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplified = useMemo(() => {
    if (den === 0) return { num: 0, den: 0 };
    const common = Math.abs(gcd(num, den));
    return { num: num / common, den: den / common };
  }, [num, den]);

  const decimal = den !== 0 ? num / den : 0;
  const percent = decimal * 100;

  useEffect(() => {
    setDecimalInput(decimal.toFixed(2));
    setPercentInput(percent.toFixed(0));
    
    const w = Math.floor(num / den);
    const r = num % den;
    setMixedInput({ whole: w, num: r, den: den });
  }, [num, den]);

  const handleDecimalChange = (val: string) => {
    setDecimalInput(val);
    const d = parseFloat(val);
    if (!isNaN(d)) {
      const multiplier = 10000;
      const n = Math.round(d * multiplier);
      const common = gcd(n, multiplier);
      setNum(n / common);
      setDen(multiplier / common);
    }
  };

  const handlePercentChange = (val: string) => {
    setPercentInput(val);
    const p = parseFloat(val);
    if (!isNaN(p)) {
      const d = p / 100;
      const multiplier = 10000;
      const n = Math.round(d * multiplier);
      const common = gcd(n, multiplier);
      setNum(n / common);
      setDen(multiplier / common);
    }
  };

  const handleMixedChange = (field: 'whole' | 'num' | 'den', val: number) => {
    const newMixed = { ...mixedInput, [field]: val };
    setMixedInput(newMixed);
    
    if (newMixed.den !== 0) {
      const newNum = (newMixed.whole * newMixed.den) + newMixed.num;
      setNum(newNum);
      setDen(newMixed.den);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Visualizers Top Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pie Chart</h4>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#fffbeb" stroke="#fde68a" strokeWidth="2" />
              {den > 0 && (
                <path
                  d={`M 50 50 L ${50 + 45 * Math.cos(0)} ${50 + 45 * Math.sin(0)} A 45 45 0 ${decimal % 1 > 0.5 ? 1 : 0} 1 ${50 + 45 * Math.cos((decimal % 1) * 2 * Math.PI)} ${50 + 45 * Math.sin((decimal % 1) * 2 * Math.PI)} Z`}
                  fill="#f59e0b"
                  className="transition-all duration-500"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-amber-600 text-xs">
              {percent.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Progress Bar</h4>
          <div className="h-full flex flex-col justify-center space-y-3">
            <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 p-0.5">
              <div 
                className="h-full bg-amber-500 rounded-md transition-all duration-500 shadow-inner"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
            <p className="text-center text-[10px] font-bold text-gray-500 uppercase">
              Nilai: <span className="text-amber-600">{decimal.toFixed(2)}</span> / 1.00
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Grid 10x10</h4>
          <div className="grid grid-cols-10 gap-0.5 bg-gray-50 p-1 rounded border border-gray-200">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-[1px] transition-colors duration-200 ${
                  i < percent ? 'bg-amber-500' : 'bg-white'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Converter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Pecahan Biasa */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-t-4 border-amber-500 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-4">
            <Divide className="text-amber-500" size={16} />
            <h3 className="font-bold text-sm text-gray-700">Pecahan Biasa</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center space-y-1">
            <input 
              type="number" 
              value={num}
              onChange={e => setNum(parseInt(e.target.value) || 0)}
              className="w-20 text-center py-2 bg-amber-50 rounded-lg text-xl font-bold text-amber-700 border border-transparent focus:border-amber-400 focus:bg-white outline-none transition-all"
            />
            <div className="w-16 h-0.5 bg-gray-300 rounded-full" />
            <input 
              type="number" 
              value={den}
              onChange={e => setDen(parseInt(e.target.value) || 1)}
              className="w-20 text-center py-2 bg-amber-50 rounded-lg text-xl font-bold text-amber-700 border border-transparent focus:border-amber-400 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* 2. Pecahan Campuran */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-t-4 border-orange-500 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-4">
            <Layers className="text-orange-500" size={16} />
            <h3 className="font-bold text-sm text-gray-700">Campuran</h3>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-2">
             <input 
              type="number" 
              value={mixedInput.whole}
              onChange={e => handleMixedChange('whole', parseInt(e.target.value) || 0)}
              className="w-14 text-center py-3 bg-orange-50 rounded-lg text-2xl font-bold text-orange-700 border border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all"
            />
            <div className="flex flex-col items-center space-y-1">
              <input 
                type="number" 
                value={mixedInput.num}
                onChange={e => handleMixedChange('num', parseInt(e.target.value) || 0)}
                className="w-12 text-center py-1 bg-orange-50 rounded-md text-sm font-bold text-orange-700 border border-transparent focus:border-orange-400 focus:bg-white outline-none"
              />
              <div className="w-10 h-0.5 bg-gray-300" />
              <input 
                type="number" 
                value={mixedInput.den}
                onChange={e => handleMixedChange('den', parseInt(e.target.value) || 1)}
                className="w-12 text-center py-1 bg-orange-50 rounded-md text-sm font-bold text-orange-700 border border-transparent focus:border-orange-400 focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Desimal */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-t-4 border-blue-500 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-4">
            <CircleDot className="text-blue-500" size={16} />
            <h3 className="font-bold text-sm text-gray-700">Desimal</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative group">
              <input 
                type="text" 
                value={decimalInput}
                onChange={e => handleDecimalChange(e.target.value)}
                className="w-full text-center py-3.5 bg-blue-50 rounded-xl text-2xl font-bold text-blue-700 border border-transparent group-hover:border-blue-200 focus:border-blue-500 focus:bg-white outline-none transition-all"
              />
              <div className="absolute top-1 right-2 text-[8px] font-bold text-blue-300 uppercase">Point</div>
            </div>
          </div>
        </div>

        {/* 4. Persen */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-t-4 border-green-500 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-4">
            <Percent className="text-green-500" size={16} />
            <h3 className="font-bold text-sm text-gray-700">Persen</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative group">
              <input 
                type="text" 
                value={percentInput}
                onChange={e => handlePercentChange(e.target.value)}
                className="w-full text-center py-3.5 bg-green-50 rounded-xl text-2xl font-bold text-green-700 border border-transparent group-hover:border-green-200 focus:border-green-500 focus:bg-white outline-none transition-all"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-3 text-lg font-bold text-green-300">%</div>
            </div>
          </div>
        </div>

      </div>

      {/* Analysis & Simplification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <ArrowRightLeft size={160} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Info className="mr-2" size={18} />
              Konsep Pecahan
            </h3>
            <div className="space-y-3 text-indigo-50">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="font-bold text-white text-xs mb-1">Visualisasi:</p>
                <p className="text-[13px] leading-relaxed">
                  Pecahan <span className="font-black text-amber-300">{num}/{den}</span> berarti kamu membagi satu benda utuh menjadi <span className="font-bold">{den}</span> bagian, dan kamu mengambil <span className="font-bold">{num}</span> bagian di antaranya.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="font-bold text-white text-xs mb-1">Desimal & Persen:</p>
                <p className="text-[13px] leading-relaxed">
                  Nilainya adalah <span className="font-black text-blue-300">{decimal.toFixed(2)}</span> atau <span className="font-black text-green-300">{percent.toFixed(0)}%</span> dari keseluruhan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <RefreshCw className="mr-2 text-amber-600" size={18} />
            Penyederhanaan
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
              <div className="text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Input</p>
                <p className="text-lg font-bold text-gray-400">{num}/{den}</p>
              </div>
              <ArrowRightLeft className="text-gray-300" size={20} />
              <div className="text-center">
                <p className="text-[8px] font-bold text-amber-500 uppercase mb-1">Sederhana</p>
                <p className="text-2xl font-black text-amber-600">{simplified.num}/{simplified.den}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                <p className="text-[10px] text-amber-600 font-bold uppercase mb-0.5">FPB</p>
                <p className="text-lg font-black text-amber-800">{Math.abs(gcd(num, den))}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">Tipe</p>
                <p className="text-xs font-black text-blue-800 uppercase">
                  {num > den ? 'Tidak Murni' : 'Murni'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionLab;
