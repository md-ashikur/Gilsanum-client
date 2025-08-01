import { useRef, useEffect, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { useGetProductsQuery } from "../../store/api";
import "mapbox-gl/dist/mapbox-gl.css";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  shop?: {
    name: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

interface Shop {
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  products: Product[];
}

interface ProductMapProps {
  searchTerm?: string;
  filteredProducts?: Product[];
}

const INITIAL_CENTER: [number, number] = [-74.0060, 40.7128];
const INITIAL_ZOOM = 11;

export default function ProductMap({ searchTerm = "", filteredProducts }: ProductMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);

  const { data: response, isLoading, error } = useGetProductsQuery({});

  // Use filtered products if provided, otherwise use all products (memoized)
  const products: Product[] = useMemo(
    () => filteredProducts || response?.data || [],
    [filteredProducts, response?.data]
  );
  
  // Group products by shop (memoized to prevent infinite loop)
  const shops: Shop[] = useMemo(() => {
    return products.reduce((acc: Shop[], product: Product) => {
      if (product.shop) {
        const existingShop = acc.find(shop => shop.name === product.shop!.name);
        if (existingShop) {
          existingShop.products.push(product);
        } else {
          acc.push({
            name: product.shop.name,
            location: product.shop.location,
            products: [product]
          });
        }
      }
      return acc;
    }, []);
  }, [products]);

  // Filter shops based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.products.some(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredShops(filtered);
    }
  }, [searchTerm, shops]);

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Create marker for shop
  const createShopMarker = (shop: Shop) => {
    if (!mapRef.current) return;

    // Calculate total value of products in shop
    const totalValue = shop.products.reduce((sum, product) => sum + product.price, 0);
    const productCount = shop.products.length;

    // Create custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div class="marker-content">
        <div class="marker-price">$${totalValue.toLocaleString()}</div>
        <div class="marker-count">${productCount} items</div>
      </div>
    `;

    // Create popup content
    const popupContent = `
      <div class="shop-popup">
        <h3 class="shop-name">${shop.name}</h3>
        <p class="shop-address">${shop.location.address}</p>
        <div class="shop-products">
          <h4>Available Products:</h4>
          ${shop.products.map(product => `
            <div class="product-item">
              <span class="product-name">${product.name}</span>
              <span class="product-price">$${product.price}</span>
            </div>
          `).join('')}
        </div>
        <div class="shop-total">
          <strong>Total Value: $${totalValue.toLocaleString()}</strong>
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false
    }).setHTML(popupContent);

    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat([shop.location.lng, shop.location.lat])
      .setPopup(popup)
      .addTo(mapRef.current);

    markersRef.current.push(marker);
  };

  useEffect(() => {
    // Set the access token
    mapboxgl.accessToken = "pk.eyJ1IjoibWFydWYtNjkiLCJhIjoiY21kcThhZnUxMDM2ZjJqcjV3amtpYnNmOCJ9.1tKWcQqfekzdgMZGoUubfg";
    
    // Initialize map only once
    if (mapContainerRef.current && !mapRef.current) {
      console.log('Initializing map...');
      
      try {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/light-v11', // Use light-v11 style
          center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
          attributionControl: false
        });

        mapRef.current.on('load', () => {
          console.log('Map loaded successfully');
        });

        mapRef.current.on('style.load', () => {
          console.log('Map style loaded');
          // Add markers after style loads
          filteredShops.forEach(createShopMarker);
        });

        mapRef.current.on('error', (e) => {
          console.error('Map error:', e.error);
        });

        mapRef.current.on('move', () => {
          if (mapRef.current) {
            const mapCenter = mapRef.current.getCenter();
            const mapZoom = mapRef.current.getZoom();
            // Update internal state if needed for debugging
            console.log('Map moved to:', mapCenter.lng, mapCenter.lat, 'zoom:', mapZoom);
          }
        });

      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }

    return () => {
      if (mapRef.current) {
        console.log('Cleaning up map...');
        clearMarkers();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    }, [filteredShops]); // Include filteredShops dependency  // Separate effect for updating markers when shops or search changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      console.log('Updating markers for shops:', filteredShops.length);
      clearMarkers();
      filteredShops.forEach(createShopMarker);

      // If there's a search result, fly to the first shop
      if (filteredShops.length > 0 && searchTerm.trim() !== "") {
        const firstShop = filteredShops[0];
        console.log('Flying to shop:', firstShop.name);
        mapRef.current.flyTo({
          center: [firstShop.location.lng, firstShop.location.lat],
          zoom: 14,
          duration: 1000
        });
      }
    }
  }, [filteredShops, searchTerm]);

  // Effect to add markers when map loads
  useEffect(() => {
    if (mapRef.current && filteredShops.length > 0) {
      mapRef.current.on('style.load', () => {
        console.log('Adding markers on style load:', filteredShops.length);
        filteredShops.forEach(createShopMarker);
      });
    }
  }, [filteredShops]);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-red-500">Failed to load map data</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        ref={mapContainerRef}
        className="w-full h-full sm:h-72 lg:h-full"
        style={{ 
          minHeight: '250px',
          position: 'relative',
          
        }}
      />
    </div>
  );
}
