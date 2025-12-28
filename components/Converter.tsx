
import React, { useState, useMemo } from 'react';
import { Ruler, Layers, Box, Weight, Clock, ArrowDown, ArrowUp, Info, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { ConversionCategory } from '../types';

const CATEGORIES: { id: ConversionCategory; label: string; icon: any; color: string }[] = [
  { id: 'length', label: 'Panjang', icon: Ruler, color: 'blue' },
  { id: 'area', label: 'Luas', icon: Layers, color: 'green' },
  { id: 'volume', label: 'Volume', icon: Box, color: 'purple' },
  { id: 'weight', label: 'Berat', icon: Weight, color: 'orange' },
  { id: 'time', label: 'Waktu', icon: Clock, color: 'red' },
];

const UNITS_MAP = {
  length: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
  area: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'],
  volume: ['km³', 'hm³', 'dam³', 'm³', 'dm³', 'cm³', 'mm³'],
  weight: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
  time: ['tahun', 'bulan', 'hari', 'jam', 'menit', 'detik', 'ms'],
};

const TIME_FACTORS: Record<string, number> = {
  'tahun': 31536000, 'bulan': 2592000, 'hari': 86400, 'jam': 3600, 'menit': 60, 'detik': 1, 'ms': 0.001,
};

const Converter: React.FC = () => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');

  const units = UNITS_MAP[category];
  
  React.useEffect(() => {
    setFromUnit(units[0]);
    setToUnit(units[units.length > 3 ? 3 : units.length - 1]);
  }, [category]);

  const fromIndex = units.indexOf(fromUnit);
  const toIndex = units.indexOf(toUnit);
  const diff = toIndex - fromIndex;
  
  const result = useMemo(() => {
    if (category === 'time') {
      const fromFactor = TIME_FACTORS[fromUnit] || 1;
      const toFactor = TIME_FACTORS[toUnit] || 1;
      return (inputValue * fromFactor) / toFactor;
    } else {
      const factor = category === 'area' ? 100 : category === 'volume' ? 1000 : 10;
      return inputValue * Math.pow(factor, diff);
    }
  }, [inputValue, fromUnit, toUnit, category, diff]);

  const stepText = useMemo(() => {
    if (diff === 0) return "Satuan sama, tidak ada perubahan.";
    if (category === 'time') return fromIndex < toIndex ? "Konversi dari satuan besar ke kecil." : "Konversi dari satuan kecil ke besar.";
    const direction = diff > 0 ? "Turun" : "Naik";
    const factor = category === 'area' ? 100 : category === 'volume' ? 1000 : 10;
    return `${direction} ${Math.abs(diff)} tangga, maka ${diff > 0 ? 'dikali' : 'dibagi'} ${Math.pow(factor, Math.abs(diff)).toLocaleString('id-ID')}`;
  }, [diff, category]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Pilih Kategori Konversi</label>
          <div className="relative group">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as ConversionCategory)}
              className="w-full appearance-none bg-indigo-50 border border-indigo-100 text-indigo-900 font-bold py-3.5 px-4 pr-10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-3 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl">
          {React.createElement(CATEGORIES.find(c => c.id === category)?.icon || Ruler, { size: 20 })}
          <span className="text-sm">Unit: {units.join(', ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Tangga Visual</h3>
          <div className="relative">
            {units.map((unit, idx) => {
              const isActive = (fromIndex <= toIndex) ? (idx >= fromIndex && idx <= toIndex) : (idx >= toIndex && idx <= fromIndex);
              return (
                <div key={unit} style={{ marginLeft: `${idx * 30}px` }} className={`flex items-center space-x-4 mb-2 p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50' : ''} ${idx === fromIndex ? 'ring-2 ring-blue-500' : ''} ${idx === toIndex ? 'ring-2 ring-green-500' : ''}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs ${idx === fromIndex ? 'bg-blue-600 text-white' : idx === toIndex ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{unit}</div>
                  {isActive && idx !== toIndex && <div className="text-[10px] font-bold text-indigo-400">{diff > 0 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><ArrowLeftRight className="mr-2 text-indigo-600" />Kalkulator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Nilai Awal</label>
                <input type="number" value={inputValue} onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Dari Satuan</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-lg font-semibold">{units.map(u => <option key={u} value={u}>{u}</option>)}</select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Ke Satuan</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-lg font-semibold">{units.map(u => <option key={u} value={u}>{u}</option>)}</select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hasil</label>
                <div className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xl font-bold break-all flex items-center justify-between">
                  <span>{result.toLocaleString('id-ID', { maximumFractionDigits: 10 })}</span>
                  <span className="text-xs">{toUnit}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10"><h4 className="font-bold mb-2 flex items-center"><Info size={20} className="mr-2" />Analisis</h4><p className="text-indigo-100 text-sm font-medium mb-4">{stepText}</p><div className="p-3 bg-white/10 rounded-xl border border-white/20 font-mono text-sm">{inputValue} {fromUnit} = {result.toLocaleString('id-ID', { maximumFractionDigits: 6 })} {toUnit}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
