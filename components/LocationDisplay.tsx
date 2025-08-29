import React from 'react';

interface LocationDisplayProps {
  address: string | null;
  onRelocate: () => void;
  isGeoLoading: boolean;
  isAddressLoading: boolean;
  geoError: string | null;
  addressError: string | null;
  texts: {
    currentAddress: string;
    fetchingAddress: string;
    addressError: string;
    relocateButton: string;
    relocatingButton: string;
  }
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ address, onRelocate, isGeoLoading, isAddressLoading, geoError, addressError, texts }) => {
  const combinedError = geoError || addressError;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-bold text-gray-800">{texts.currentAddress}</h3>
            {isAddressLoading ? (
                <p className="text-xs text-gray-500 animate-pulse">{texts.fetchingAddress}</p>
            ) : address ? (
                <p className="text-sm text-gray-700 truncate">{address}</p>
            ) : (
                <p className="text-xs text-gray-500">
                {isGeoLoading ? texts.relocatingButton : '...'}
                </p>
            )}
        </div>
        <button 
          onClick={onRelocate}
          disabled={isGeoLoading}
          className="flex-shrink-0 flex items-center justify-center bg-white text-orange-600 font-semibold py-2 px-3 rounded-lg shadow border border-gray-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          aria-label={texts.relocateButton}
        >
          {isGeoLoading ? (
            <svg className="animate-spin h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          )}
          <span className="ml-2 hidden sm:inline">{isGeoLoading ? texts.relocatingButton : texts.relocateButton}</span>
        </button>
      </div>
      {combinedError && (
        <p className="text-xs text-red-600 bg-red-100 p-2 rounded-md">{combinedError}</p>
      )}
    </div>
  );
};

export default LocationDisplay;
