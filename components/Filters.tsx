
import React from 'react';
import { Filters, PricePref, DistancePref } from '../types';

interface FiltersProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  disabled: boolean;
  texts: {
      price: string;
      distance: string;
      priceOptions: Record<PricePref, string>;
      distanceOptions: Record<DistancePref, string>;
  }
}

const FilterButton = <T,>({ value, label, current, onClick, disabled }: { value: T, label: string, current: T, onClick: (value: T) => void, disabled: boolean }) => {
  const isActive = value === current;
  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`flex-1 py-2 px-3 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
        ${isActive ? 'bg-orange-500 text-white font-bold shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {label}
    </button>
  );
};

const FiltersComponent: React.FC<FiltersProps> = ({ filters, onFilterChange, disabled, texts }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white rounded-2xl shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{texts.price}</label>
        <div className="flex space-x-2">
          <FilterButton value={PricePref.Any} label={texts.priceOptions.any} current={filters.pricePref} onClick={(v) => onFilterChange('pricePref', v)} disabled={disabled} />
          <FilterButton value={PricePref.Cheap} label={texts.priceOptions.cheap} current={filters.pricePref} onClick={(v) => onFilterChange('pricePref', v)} disabled={disabled} />
          <FilterButton value={PricePref.Normal} label={texts.priceOptions.normal} current={filters.pricePref} onClick={(v) => onFilterChange('pricePref', v)} disabled={disabled} />
          <FilterButton value={PricePref.Expensive} label={texts.priceOptions.expensive} current={filters.pricePref} onClick={(v) => onFilterChange('pricePref', v)} disabled={disabled} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{texts.distance}</label>
        <div className="flex space-x-2">
          <FilterButton value={DistancePref.Any} label={texts.distanceOptions.any} current={filters.distancePref} onClick={(v) => onFilterChange('distancePref', v)} disabled={disabled}/>
          <FilterButton value={DistancePref.Near} label={texts.distanceOptions.near} current={filters.distancePref} onClick={(v) => onFilterChange('distancePref', v)} disabled={disabled}/>
          <FilterButton value={DistancePref.Normal} label={texts.distanceOptions.normal} current={filters.distancePref} onClick={(v) => onFilterChange('distancePref', v)} disabled={disabled}/>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;
