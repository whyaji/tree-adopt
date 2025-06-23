/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStore } from '@tanstack/react-form';
import { useEffect, useRef, useState } from 'react';

import { MAPS_CENTER } from '@/constants/maps';

export function useMapsState(defaultParams: { form: any; center?: [number, number] }) {
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    defaultParams.center ?? MAPS_CENTER.DEFAULT
  );
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const latitude = useStore(defaultParams.form.store, (s: any) => s.values.latitude);
  const longitude = useStore(defaultParams.form.store, (s: any) => s.values.longitude);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const newCenter: [number, number] = [lat, lng];
      setMarkerPosition(newCenter);
      setMapCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.setView(newCenter, mapRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  const handleLocationSelect = (lat: number, lng: number) => {
    defaultParams.form.setFieldValue('latitude', String(lat));
    defaultParams.form.setFieldValue('longitude', String(lng));

    defaultParams.form.setFieldMeta('latitude', (meta: any) => ({
      ...meta,
      errorMap: {},
    }));
    defaultParams.form.setFieldMeta('longitude', (meta: any) => ({
      ...meta,
      errorMap: {},
    }));
  };

  return {
    mapRef,
    mapCenter,
    markerPosition,
    handleLocationSelect,
    setMarkerPosition,
  };
}
