
import React from 'react';
import { ShapeType, GeometryState, CalculationResult, CalculationDetail } from '../types';

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (dims: Partial<GeometryState['dimensions']>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label} (cm)</label>
    <input
      type="number"
      inputMode="decimal"
      value={value === 0 ? '' : value}
      onChange={(e) => {
        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
        onChange({ [name]: val });
      }}
      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-base transition-all font-medium"
      placeholder="0"
    />
  </div>
);

const ResultItem: React.FC<{ label: string; detail?: CalculationDetail; color: string }> = ({ label, detail, color }) => {
  if (!detail) return null;
  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={`text-lg font-mono font-bold ${color}`}>{detail.value.toFixed(2)} cm{label.includes('Luas') || label.includes('Permukaan') ? '²' : label.includes('Volume') ? '³' : ''}</span>
      </div>
      <div className="pt-2 border-t border-gray-50">
        <div className="flex items-center text-[10px] text-gray-400 mb-1">
          <span className="bg-gray-100 px-1.5 py-0.5 rounded mr-1.5 font-bold">RUMUS</span>
          <span className="font-mono">{detail.formula}</span>
        </div>
        <div className="flex items-center text-[11px] text-blue-600 font-medium">
          <span className="bg-blue-50 px-1.5 py-0.5 rounded mr-1.5 font-bold">LANGKAH</span>
          <span className="font-mono">{detail.steps}</span>
        </div>
      </div>
    </div>
  );
};

interface CalculatorProps {
  state: GeometryState;
  onChange: (dims: Partial<GeometryState['dimensions']>) => void;
  results: CalculationResult;
}

const Calculator: React.FC<CalculatorProps> = ({ state, onChange, results }) => {
  const renderInputs = () => {
    switch (state.type) {
      case ShapeType.SQUARE:
      case ShapeType.CUBE:
        return <InputField label="Panjang Sisi (s)" name="side" value={state.dimensions.side || 0} onChange={onChange} />;
      case ShapeType.RECTANGLE:
      case ShapeType.CUBOID:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Panjang (p)" name="width" value={state.dimensions.width || 0} onChange={onChange} />
            <InputField label="Lebar (l)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
            {/* Fix: Removed ShapeType.PYRAMID from this comparison because it is handled separately and causes a type overlap error here as state.type is restricted to RECTANGLE | CUBOID in this branch */}
            {state.type === ShapeType.CUBOID && (
              <div className="col-span-2">
                <InputField label="Tinggi (t)" name="depth" value={state.dimensions.depth || 0} onChange={onChange} />
              </div>
            )}
          </div>
        );
      case ShapeType.TRIANGLE:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Alas (a)" name="base" value={state.dimensions.base || 0} onChange={onChange} />
            <InputField label="Tinggi (t)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
          </div>
        );
      case ShapeType.CIRCLE:
      case ShapeType.SPHERE:
        return <InputField label="Jari-jari (r)" name="radius" value={state.dimensions.radius || 0} onChange={onChange} />;
      case ShapeType.TRAPEZOID:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Alas Bawah (a)" name="base" value={state.dimensions.base || 0} onChange={onChange} />
            <InputField label="Alas Atas (b)" name="baseTop" value={state.dimensions.baseTop || 0} onChange={onChange} />
            <div className="col-span-2">
              <InputField label="Tinggi (t)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
            </div>
          </div>
        );
      case ShapeType.PARALLELOGRAM:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Alas (a)" name="base" value={state.dimensions.base || 0} onChange={onChange} />
            <InputField label="Sisi Miring (b)" name="width" value={state.dimensions.width || 0} onChange={onChange} />
            <div className="col-span-2">
              <InputField label="Tinggi (t)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
            </div>
          </div>
        );
      case ShapeType.CYLINDER:
      case ShapeType.CONE:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Jari-jari (r)" name="radius" value={state.dimensions.radius || 0} onChange={onChange} />
            <InputField label="Tinggi (t)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
          </div>
        );
      case ShapeType.PYRAMID:
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Panjang Alas (p)" name="width" value={state.dimensions.width || 0} onChange={onChange} />
            <InputField label="Lebar Alas (l)" name="depth" value={state.dimensions.depth || 0} onChange={onChange} />
            <div className="col-span-2">
              <InputField label="Tinggi Limas (t)" name="height" value={state.dimensions.height || 0} onChange={onChange} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wider">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px] mr-2">01</span>
          Masukkan Dimensi
        </h3>
        {renderInputs()}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center uppercase tracking-wider px-2">
          <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-[10px] mr-2">02</span>
          Langkah & Hasil
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <ResultItem label="Luas" detail={results.area} color="text-blue-600" />
          <ResultItem label="Keliling" detail={results.perimeter} color="text-blue-600" />
          <ResultItem label="Volume" detail={results.volume} color="text-green-600" />
          <ResultItem label="Luas Permukaan" detail={results.surfaceArea} color="text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
