

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useGetProductsQuery } from '../../store/api';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  products: Product[];
}

interface MarkerProps {
  position: google.maps.LatLngLiteral;
  product: Product;
  map: google.maps.Map;
}

const Marker: React.FC<MarkerProps> = ({ position, product, map }) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position,
        map,
        title: product.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      infoWindowRef.current = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${product.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${product.location.address}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 18px; font-weight: 700; color: #3b82f6;">$${product.price.toLocaleString()}</span>
              <button style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">View Details</button>
            </div>
          </div>
        `
      });

      markerRef.current.addListener('click', () => {
        infoWindowRef.current?.open(map, markerRef.current);
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [position, product, map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    }
  }, [position]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({ center, zoom, products }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  return (
    <>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {map &&
        products.map((product) => (
          <Marker
            key={product.id}
            position={{ lat: product.location.lat, lng: product.location.lng }}
            product={product}
            map={map}
          />
        ))}
    </>
  );
};

const LoadingComponent = () => (
  <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <div className="text-sm">Loading Map...</div>
    </div>
  </div>
);

const ErrorComponent = ({ status }: { status: Status }) => (
  <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center text-red-500">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.366 15.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <div className="text-sm">Failed to load map: {status}</div>
    </div>
  </div>
);

export default function ProductMap() {
  const { data: response, isLoading, error } = useGetProductsQuery({});
  
  const products: Product[] = useMemo(() => {
    const allProducts = response?.data || [];
    return allProducts.filter(product => product.location) as Product[];
  }, [response?.data]);

  const render = useCallback((status: Status) => {
    if (status === Status.LOADING) return <LoadingComponent />;
    if (status === Status.FAILURE) return <ErrorComponent status={status} />;
    return (
      <MapComponent
        center={{ lat: 40.7128, lng: -74.0060 }} // New York City center
        zoom={10}
        products={products}
      />
    );
  }, [products]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent status={Status.FAILURE} />;
  }

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden">
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
        render={render}
        libraries={['places']}
      />
    </div>
  );
}
