import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus, PricePref, DistancePref } from './types';
import type { Place, Filters, Coordinates, Language } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchRecommendation, fetchAddressFromCoordinates } from './services/geminiService';
import { translations } from './locales';
import Header from './components/Header';
import PermissionPrompt from './components/PermissionPrompt';
import FiltersComponent from './components/Filters';
import RecommendationCard from './components/RecommendationCard';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import LanguageToggle from './components/LanguageToggle';
import LocationDisplay from './components/LocationDisplay';

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('ko');
    const [status, setStatus] = useState<AppStatus>(AppStatus.GETTING_LOCATION);
    const [filters, setFilters] = useState<Filters>({
        pricePref: PricePref.Normal,
        distancePref: DistancePref.Near,
    });
    const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
    const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
    const [geoErrorMessage, setGeoErrorMessage] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);
    const [addressError, setAddressError] = useState<string | null>(null);

    const { 
        coordinates: geoCoordinates, 
        error: geoError, 
        loading: geoLoading, 
        getLocation 
    } = useGeolocation();

    const t = translations[language];
    
    useEffect(() => {
        // Automatically fetch location on initial load
        if (status === AppStatus.GETTING_LOCATION) {
            getLocation();
        }
    }, [status, getLocation]);

    useEffect(() => {
        if (geoCoordinates) {
            setUserCoordinates(geoCoordinates);
            setGeoErrorMessage(null);
            if (status === AppStatus.GETTING_LOCATION) {
                setStatus(AppStatus.READY);
            }
            
            const getAddress = async () => {
                setIsFetchingAddress(true);
                setAddressError(null);
                try {
                    const fetchedAddress = await fetchAddressFromCoordinates(geoCoordinates, language);
                    setAddress(fetchedAddress);
                } catch (err) {
                    setAddressError(t.locationDisplay.addressError);
                } finally {
                    setIsFetchingAddress(false);
                }
            };
            getAddress();

        }
    }, [geoCoordinates, status, language, t]);

    useEffect(() => {
        if (geoError) {
            let errorMessage = t.app.geolocationErrors.prefix;
            if (typeof GeolocationPositionError !== 'undefined' && geoError instanceof GeolocationPositionError) {
                switch (geoError.code) {
                    case 1: errorMessage += t.app.geolocationErrors.permissionDenied; break;
                    case 2: errorMessage += t.app.geolocationErrors.positionUnavailable; break;
                    case 3: errorMessage += t.app.geolocationErrors.timeout; break;
                    default: errorMessage += t.app.geolocationErrors.unknown; break;
                }
            } else {
                errorMessage += t.app.geolocationErrors.unknown;
            }
            
            if (status === AppStatus.GETTING_LOCATION) {
                // Initial load failed, go to main error screen
                setError(errorMessage);
                setStatus(AppStatus.ERROR);
            } else {
                // Relocate button failed, show error in component
                setGeoErrorMessage(errorMessage);
            }
        }
    }, [geoError, t, status]);
    
    const handleFilterChange = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const getRecommendation = useCallback(async () => {
        if (!userCoordinates) {
            setError(t.app.recommendationError);
            setStatus(AppStatus.ERROR);
            return;
        }
        
        setStatus(AppStatus.RECOMMENDING);
        setError(null);

        try {
            const place = await fetchRecommendation(userCoordinates, filters, recentPlaces, language);
            setCurrentPlace(place);
            setRecentPlaces(prev => [place, ...prev].slice(0, 10));
            setStatus(AppStatus.SHOWING_RESULT);
        } catch (e) {
            const errorMessage = e instanceof Error 
                ? (e.message.includes("FAILED") ? t.app.geminiError : (e.message || t.app.unknownError))
                                : t.app.unknownError;
            setError(errorMessage);
            setStatus(AppStatus.ERROR);
        }
    }, [userCoordinates, filters, recentPlaces, language, t]);

    const handleGrantPermission = () => {
        setStatus(AppStatus.GETTING_LOCATION);
        setError(null);
        setGeoErrorMessage(null);
        getLocation();
    };

    const handleRelocate = useCallback(() => {
        setGeoErrorMessage(null);
        setAddress(null);
        setAddressError(null);
        getLocation();
    }, [getLocation]);

    const handleRetry = () => {
        setError(null);
        setStatus(AppStatus.GETTING_LOCATION);
    };

    const handleGoHome = () => {
        setStatus(AppStatus.READY);
        setCurrentPlace(null);
        setError(null);
    };

    const handleToggleLanguage = () => {
      setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
    };

    const renderContent = () => {
        switch (status) {
            case AppStatus.PROMPTING_PERMISSION: // Kept for explicit retry flows
                return <PermissionPrompt onGrant={handleGrantPermission} loading={geoLoading} error={error} texts={t.permissionPrompt} />;
            case AppStatus.GETTING_LOCATION:
                 return <Loader messages={t.loader.map(msg => t.permissionPrompt.loading)} />;
            case AppStatus.READY:
                return (
                    <div className="w-full space-y-4">
                        <LocationDisplay 
                            address={address}
                            onRelocate={handleRelocate}
                            isGeoLoading={geoLoading}
                            isAddressLoading={isFetchingAddress}
                            geoError={geoErrorMessage}
                            addressError={addressError}
                            texts={t.locationDisplay}
                        />
                        <FiltersComponent filters={filters} onFilterChange={handleFilterChange} disabled={false} texts={t.filters} />
                        <button onClick={getRecommendation} className="w-full max-w-md mx-auto flex items-center justify-center bg-orange-500 text-white font-black text-xl py-5 px-6 rounded-2xl shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105">
                            {t.app.recommendButton}
                        </button>
                    </div>
                );
            case AppStatus.RECOMMENDING:
                return <Loader messages={t.loader} />;
            case AppStatus.SHOWING_RESULT:
                return currentPlace ? (
                    <RecommendationCard 
                        place={currentPlace} 
                        onReroll={getRecommendation} 
                        onGoHome={handleGoHome}
                        isRerolling={false} 
                        texts={t.recommendationCard} 
                    />
                ) : null;
            case AppStatus.ERROR:
                return <ErrorDisplay 
                            message={error || t.app.unknownError} 
                            onRetry={handleRetry}
                            onGoHome={handleGoHome}
                            texts={t.errorDisplay} 
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 relative">
            <LanguageToggle language={language} onToggle={handleToggleLanguage} text={t.languageToggle} />
            <Header texts={t.header} />
            <main className="w-full flex-grow flex items-center justify-center">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;