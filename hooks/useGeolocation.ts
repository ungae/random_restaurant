
import { useState, useCallback, useEffect } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  loading: boolean;
  coordinates: Coordinates | null;
  error: GeolocationPositionError | Error | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    coordinates: null,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        error: new Error("Geolocation is not supported by your browser."),
        loading: false,
      }));
      return;
    }

    setState({ loading: true, coordinates: null, error: null });

    const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        setState({
          loading: false,
          coordinates: null,
          error: error,
        });
      },
      options
    );
  }, []);

  return { ...state, getLocation };
};
