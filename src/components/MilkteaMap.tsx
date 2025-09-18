import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom milk tea marker icon
const milkteaIcon = new L.DivIcon({
  className: 'custom-milk-tea-marker',
  html: `
    <div style="
      background: #3B82F6;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">🧋</span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Fix for default markers in react-leaflet (fallback)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MilkteaShop {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
}

interface MilkteaData {
  shops: MilkteaShop[];
}

const MilkteaMap: React.FC = () => {
  const [shops, setShops] = useState<MilkteaShop[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Taipei center coordinates
  const taipeiCenter: [number, number] = [25.0330, 121.5654];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/milktea-shops.json');
        const data: MilkteaData = await response.json();
        setShops(data.shops);
      } catch (error) {
        console.error('Failed to load milktea shops data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredShops = shops.filter(shop => 
    activeFilter === 'all' || shop.category === activeFilter
  );

  const filters = [
    { id: 'all', label: 'All', emoji: '🗺️' },
    { id: 'milktea', label: 'Milk Tea', emoji: '🧋' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading milk tea shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-gray-100">
      <style jsx>{`
        .leaflet-container {
          border-radius: 0px;
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          border: none !important;
          background: white !important;
          color: #374151 !important;
          font-weight: 500;
          width: 36px !important;
          height: 36px !important;
          line-height: 34px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.8) !important;
          backdrop-filter: blur(8px);
          border-radius: 6px !important;
          border: none !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
        .custom-milk-tea-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
      {/* Filter badges - positioned absolutely on top left */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg
              flex items-center gap-2 backdrop-blur-sm
              ${activeFilter === filter.id
                ? 'bg-blue-600 text-white border border-blue-700'
                : 'bg-white/90 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }
            `}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
            {filter.id !== 'all' && (
              <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                {shops.filter(shop => shop.category === filter.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Map container */}
      <MapContainer
        center={taipeiCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
      >
        {/* Using CartoDB Positron for a cleaner, Google Maps-like appearance */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Custom zoom control positioned on the right */}
        <ZoomControl position="bottomright" />
        
        {filteredShops.map((shop) => (
          <Marker 
            key={shop.id} 
            position={[shop.lat, shop.lng]}
            icon={milkteaIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  🧋 {shop.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{shop.description}</p>
                <p className="text-gray-500 text-xs">📍 {shop.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info panel */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">
          🧋 Taipei Milk Tea Spots
        </h3>
        <p className="text-sm text-gray-600">
          Showing {filteredShops.length} {activeFilter === 'all' ? 'locations' : 'milk tea shops'}
        </p>
        {activeFilter !== 'all' && (
          <p className="text-xs text-gray-500 mt-1">
            Click markers for more details
          </p>
        )}
      </div>
    </div>
  );
};

export default MilkteaMap;
