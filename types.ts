
export enum PricePref {
  Any = 'any',
  Cheap = 'cheap',
  Normal = 'normal',
  Expensive = 'expensive',
}

export enum DistancePref {
  Any = 'any',
  Near = 'near',
  Normal = 'normal',
}

export enum AppStatus {
  PROMPTING_PERMISSION = 'PROMPTING_PERMISSION',
  GETTING_LOCATION = 'GETTING_LOCATION',
  READY = 'READY',
  RECOMMENDING = 'RECOMMENDING',
  SHOWING_RESULT = 'SHOWING_RESULT',
  ERROR = 'ERROR',
}

export type Language = 'ko' | 'en';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Filters {
  pricePref: PricePref;
  distancePref: DistancePref;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  phone: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  distanceMeters: number;
  priceBand: 'cheap' | 'normal' | 'expensive' | 'unknown';
  rating: number | null;
  reviewCount: number | null;
  photoUrl: string | null;
  reason: string;
}
