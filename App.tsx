
import React, { useState, useMemo } from 'react';
import Visualizer from './components/Visualizer';
import Calculator from './components/Calculator';
import Converter from './components/Converter';
import FractionLab from './components/FractionLab';
import MotionLab from './components/MotionLab';
import { ShapeType, GeometryState, CalculationResult, CalculationDetail, AppMode } from './types';
import { 
  Calculator as CalcIcon, 
  Info, 
  Shapes, 
  ArrowLeftRight, 
  Divide, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Home,
  ChevronDown,
  Layers
} from 'lucide-react';

const WelcomeView: React.FC<{ onStart: (mode: AppMode) => void }> = ({ onStart }) => {
  const labs = [
    { 
      id: AppMode.GEOMETRY, 
      title: 'Lab Geometri', 
      desc: 'Eksplorasi bangun datar dan ruang dengan visualisasi 3D yang interaktif.',
      icon: Shapes,
      color: 'blue'
    },
    { 
      id: AppMode.MOTION, 
      title: 'Lab Kecepatan', 
      desc: 'Pahami hubungan Jarak, Kecepatan, dan Waktu melalui simulasi balapan.',
      icon: Zap,
      color: 'red'
    },
    { 
      id: AppMode.FRACTION, 
      title: 'Lab Pecahan', 
      desc: 'Visualisasikan pecahan ke dalam bentuk pie chart, grid, dan desimal.',
      icon: Divide,
      color: 'amber'
    },
    { 
      id: AppMode.CONVERTER, 
      title: 'Lab Konversi', 
      desc: 'Ubah satuan panjang, luas, berat, hingga waktu dengan tangga pintar.',
      icon: ArrowLeftRight,
      color: 'indigo'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in zoom-in duration-700">
      <div className="text-center mb-8">
    
        <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pelitanusa MathLab </span>
           SDN 3 Jelat
        </h1>
        <p className="text-gray-500 text-md md:text-xl max-w-2xl mx-auto leading-relaxed">
          Laboratorium digital untuk belajar matematika dengan cara yang lebih nyata, visual, dan menyenangkan.
        </p>
            <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mt-4 border border-blue-100 shadow-sm">
          <Sparkles size={14} />
          <span>Eksplorasi Matematika Interaktif</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => onStart(lab.id)}
            className="group relative bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className={`w-14 h-14 bg-${lab.color}-100 text-${lab.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
              <lab.icon size={28} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">{lab.title}</h3>
            <p className="hidden md:block text-gray-500 text-xs leading-relaxed mb-4">{lab.desc}</p>
            <div className={`flex items-center space-x-2 font-bold text-sm text-${lab.color}-600 group-hover:translate-x-2 transition-transform`}>
              <span>Masuk Lab</span>
              <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.WELCOME);
  const [geoState, setGeoState] = useState<GeometryState>({
    type: ShapeType.SQUARE,
    dimensions: { side: 10, width: 20, height: 10, depth: 15, radius: 8, base: 15, baseTop: 10 }
  });

  const shapes2D = [ShapeType.SQUARE, ShapeType.RECTANGLE, ShapeType.TRIANGLE, ShapeType.CIRCLE, ShapeType.TRAPEZOID, ShapeType.PARALLELOGRAM];
  const shapes3D = [ShapeType.CUBE, ShapeType.CUBOID, ShapeType.SPHERE, ShapeType.CYLINDER, ShapeType.CONE, ShapeType.PYRAMID];

  const results = useMemo<CalculationResult>(() => {
    const { type, dimensions } = geoState;
    const { side = 0, width = 0, height = 0, depth = 0, radius = 0, base = 0, baseTop = 0 } = dimensions;
    const PI = Math.PI;
    const createDetail = (val: number, formula: string, steps: string): CalculationDetail => ({ value: val, formula, steps });

    switch (type) {
      case ShapeType.SQUARE: return { area: createDetail(side * side, "s × s", `${side} × ${side}`), perimeter: createDetail(4 * side, "4 × s", `4 × ${side}`) };
      case ShapeType.RECTANGLE: return { area: createDetail(width * height, "p × l", `${width} × ${height}`), perimeter: createDetail(2 * (width + height), "2 × (p + l)", `2 × (${width} + ${height})`) };
      case ShapeType.TRIANGLE: return { area: createDetail(0.5 * base * height, "1/2 × a × t", `1/2 × ${base} × ${height}`), perimeter: createDetail(base + (2 * Math.sqrt((base/2)**2+height**2)), "a+b+c", "Penjumlahan semua sisi") };
      case ShapeType.CIRCLE: return { area: createDetail(PI * radius**2, "π × r²", `3.14 × ${radius}²`), perimeter: createDetail(2 * PI * radius, "2 × π × r", `2 × 3.14 × ${radius}`) };
      case ShapeType.TRAPEZOID: return { area: createDetail(0.5*(base+baseTop)*height, "1/2×(a+b)×t", `1/2×(${base}+${baseTop})×${height}`), perimeter: createDetail(base+baseTop+2*Math.sqrt(((base-baseTop)/2)**2+height**2), "Jumlah Sisi", "Total panjang keliling") };
      case ShapeType.PARALLELOGRAM: return { area: createDetail(base * height, "a × t", `${base} × ${height}`), perimeter: createDetail(2 * (base + width), "2 × (a + b)", `2 × (${base} + ${width})`) };
      case ShapeType.CUBE: return { volume: createDetail(side ** 3, "s³", `${side}³`), surfaceArea: createDetail(6 * side**2, "6 × s²", `6 × ${side}²`) };
      case ShapeType.CUBOID: return { volume: createDetail(width*height*depth, "p×l×t", `${width}×${height}×${depth}`), surfaceArea: createDetail(2*(width*height+width*depth+height*depth), "2×(pl+pt+lt)", "Total luas permukaan") };
      case ShapeType.SPHERE: return { volume: createDetail((4/3)*PI*radius**3, "4/3×π×r³", `4/3×3.14×${radius}³`), surfaceArea: createDetail(4*PI*radius**2, "4×π×r²", `4×3.14×${radius}²`) };
      case ShapeType.CYLINDER: return { volume: createDetail(PI*radius**2*height, "π×r²×t", `3.14×${radius}²×${height}`), surfaceArea: createDetail(2*PI*radius*(radius+height), "2×π×r×(r+t)", "Total luas permukaan") };
      case ShapeType.CONE: return { volume: createDetail((1/3)*PI*radius**2*height, "1/3×π×r²×t", "Volume Kerucut"), surfaceArea: createDetail(PI*radius*(radius+Math.sqrt(radius**2+height**2)), "π×r×(r+s)", "Luas permukaan") };
      case ShapeType.PYRAMID: return { volume: createDetail((1/3)*width*depth*height, "1/3×La×t", "Volume Limas"), surfaceArea: createDetail(width*depth + (width*Math.sqrt((depth/2)**2+height**2) + depth*Math.sqrt((width/2)**2+height**2)), "La+Ls", "Total luas") };
      default: return {};
    }
  }, [geoState]);

  const handleDimensionChange = (newDims: Partial<GeometryState['dimensions']>) => {
    setGeoState(prev => ({ ...prev, dimensions: { ...prev.dimensions, ...newDims } }));
  };

  const renderContent = () => {
    switch(appMode) {
      case AppMode.WELCOME: return <WelcomeView onStart={setAppMode} />;
      case AppMode.CONVERTER: return <Converter />;
      case AppMode.FRACTION: return <FractionLab />;
      case AppMode.MOTION: return <MotionLab />;
      case AppMode.GEOMETRY: return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Pilih Bangun Geometri</label>
              <div className="relative group max-w-md">
                <select 
                  value={geoState.type}
                  onChange={(e) => setGeoState(prev => ({ ...prev, type: e.target.value as ShapeType }))}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3.5 px-4 pr-10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <optgroup label="Bangun Datar (2D)">
                    {shapes2D.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Bangun Ruang (3D)">
                    {shapes3D.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-gray-300 uppercase">Status Lab</p>
              <div className="flex items-center text-green-500 space-x-2 font-bold"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span>Aktif</span></div>
            </div>
          </div>
          <Visualizer state={geoState} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Calculator state={geoState} onChange={handleDimensionChange} results={results} />
            <div className="space-y-6">
              <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 hidden sm:block"><CalcIcon size={120} /></div>
                <h4 className="text-lg font-bold mb-2 flex items-center"><Info size={18} className="mr-2" />Tips Belajar</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Gunakan dropdown di atas untuk berganti antar bangun datar dan ruang dengan cepat. 
                  Ubah angka pada input dimensi untuk melihat perubahan bentuk dan hasil perhitungan secara langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  const getModeTitle = () => {
    if (appMode === AppMode.WELCOME) return 'Selamat Datang';
    if (appMode === AppMode.CONVERTER) return 'Lab Konversi';
    if (appMode === AppMode.FRACTION) return 'Lab Pecahan';
    if (appMode === AppMode.MOTION) return 'Lab Kecepatan';
    return geoState.type;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {appMode !== AppMode.WELCOME && (
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
                <button 
                  onClick={() => setAppMode(AppMode.WELCOME)} 
                  className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all shadow-md flex-shrink-0"
                  aria-label="Kembali ke Beranda"
                >
                  <Home size={20} />
                </button>
                <div className="h-10 w-px bg-gray-100 mx-1 hidden sm:block" />
                <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight truncate">{getModeTitle()}</h1>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mobile Dropdown Navigator */}
                <div className="sm:hidden relative flex-1">
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10">
                      <Layers size={14} />
                    </div>
                    <select 
                      value={appMode}
                      onChange={(e) => setAppMode(e.target.value as AppMode)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 pl-9 pr-10 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer shadow-sm"
                    >
                      <option value={AppMode.GEOMETRY}>Lab Geometri</option>
                      <option value={AppMode.CONVERTER}>Lab Konversi</option>
                      <option value={AppMode.FRACTION}>Lab Pecahan</option>
                      <option value={AppMode.MOTION}>Lab Kecepatan</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Desktop Button Group Navigator */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button 
                    onClick={() => setAppMode(AppMode.MOTION)} 
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${appMode === AppMode.MOTION ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-50 text-red-600 hover:bg-red-50'}`}
                  >
                    Kecepatan
                  </button>
                  <button 
                    onClick={() => setAppMode(AppMode.FRACTION)} 
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${appMode === AppMode.FRACTION ? 'bg-amber-600 text-white shadow-lg' : 'bg-gray-50 text-amber-600 hover:bg-amber-50'}`}
                  >
                    Pecahan
                  </button>
                  <button 
                    onClick={() => setAppMode(AppMode.CONVERTER)} 
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${appMode === AppMode.CONVERTER ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    Konversi
                  </button>
                  <button 
                    onClick={() => setAppMode(AppMode.GEOMETRY)} 
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${appMode === AppMode.GEOMETRY ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-blue-600 hover:bg-blue-50'}`}
                  >
                    Geometri
                  </button>
                </div>
              </div>
            </header>
          )}
          {renderContent()}
        </div>
      </main>
      <footer className="py-8 text-center text-xs text-gray-400 font-medium tracking-widest">
        © 2025 Pelitanusa MathLab v3.5 - <a href="https://pelitanusa.sdn3jelat.sch.id" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">https://pelitanusa.sdn3jelat.sch.id</a>
      </footer>
    </div>
  );
};

export default App;
