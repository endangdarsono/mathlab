
export enum ShapeType {
  SQUARE = 'Persegi',
  RECTANGLE = 'Persegi Panjang',
  TRIANGLE = 'Segitiga',
  CIRCLE = 'Lingkaran',
  TRAPEZOID = 'Trapesium',
  PARALLELOGRAM = 'Jajar Genjang',
  CUBE = 'Kubus',
  CUBOID = 'Balok',
  SPHERE = 'Bola',
  CYLINDER = 'Tabung',
  CONE = 'Kerucut',
  PYRAMID = 'Limas Segiempat'
}

export enum AppMode {
  WELCOME = 'WELCOME',
  GEOMETRY = 'GEOMETRY',
  CONVERTER = 'CONVERTER',
  FRACTION = 'FRACTION',
  MOTION = 'MOTION'
}

export type ConversionCategory = 'length' | 'area' | 'volume' | 'weight' | 'time';

export interface GeometryState {
  type: ShapeType;
  dimensions: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    side?: number;
    base?: number;
    baseTop?: number;
    slantHeight?: number;
  };
}

export interface CalculationDetail {
  value: number;
  formula: string;
  steps: string;
}

export interface CalculationResult {
  area?: CalculationDetail;
  perimeter?: CalculationDetail;
  volume?: CalculationDetail;
  surfaceArea?: CalculationDetail;
}
