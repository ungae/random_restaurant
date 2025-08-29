import React from 'react';
import type { Place } from '../types';

interface RecommendationCardProps {
  place: Place;
  onReroll: () => void;
  onGoHome: () => void;
  isRerolling: boolean;
  texts: {
      home: string;
      reroll: string;
      directions: string;
      distance: (dist: string, time: number) => string;
      priceMap: Record<'cheap' | 'normal' | 'expensive' | 'unknown', string>;
  }
}

const InfoChip: React.FC<{ icon: JSX.Element; text: string | null | undefined;}> = ({ icon, text }) => {
    if (!text) return null;
    return (
        <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {icon}
            <span className="ml-1.5">{text}</span>
        </span>
    );
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ place, onReroll, onGoHome, isRerolling, texts }) => {
  const walkTime = Math.ceil(place.distanceMeters / 80);
  const distanceText = place.distanceMeters < 1000 
    ? `${place.distanceMeters}m`
    : `${(place.distanceMeters / 1000).toFixed(1)}km`;

  const openDirections = () => {
    const { latitude, longitude } = place.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="relative">
            <img src={place.photoUrl || 'https://picsum.photos/800/600'} alt={place.name} className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">{place.category}</span>
                <h2 className="text-2xl font-bold text-white mt-1 shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">{place.name}</h2>
            </div>
        </div>

        <div className="p-5">
            <p className="text-gray-600 italic text-center mb-4">"{place.reason}"</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-5">
                <InfoChip icon={<MapPinIcon />} text={texts.distance(distanceText, walkTime)} />
                <InfoChip icon={<PriceTagIcon />} text={texts.priceMap[place.priceBand]} />
                {place.rating && <InfoChip icon={<StarIcon />} text={`${place.rating} (${place.reviewCount})`} />}
            </div>
            
            <p className="text-sm text-gray-500 text-center mb-5 flex items-start justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {place.address}
            </p>

            <div className="grid grid-cols-3 gap-3">
                <button onClick={onGoHome} className="w-full flex items-center justify-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                    <HomeIcon />
                    {texts.home}
                </button>
                <button onClick={onReroll} disabled={isRerolling} className="w-full flex items-center justify-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait">
                    {isRerolling ? (
                         <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <RerollIcon />
                    )}
                    {texts.reroll}
                </button>
                <button onClick={openDirections} className="w-full flex items-center justify-center bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
                    <DirectionsIcon />
                    {texts.directions}
                </button>
            </div>
        </div>
    </div>
  );
};

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const RerollIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>;
const DirectionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l6.553 3.276A1 1 0 0021 19.382V8.618a1 1 0 00-.553-.894L15 5m0 12V5m0 0l6-3" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const PriceTagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

export default RecommendationCard;