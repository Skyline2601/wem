/**
 * WemMap.tsx — Native (iOS/Android)
 * Metro uses WemMap.web.tsx on web automatically
 */
import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface WemMapProps {
  style?: object;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  children?: React.ReactNode;
  mapRef?: React.RefObject<any>;
}

export function WemMap({ style, initialRegion, children, mapRef }: WemMapProps) {
  return (
    <MapView
      ref={mapRef}
      style={style}
      initialRegion={initialRegion}
      showsUserLocation={false}
      showsTraffic={false}
    >
      {children}
    </MapView>
  );
}

export { Marker, Polyline };
