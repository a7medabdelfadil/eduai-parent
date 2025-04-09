"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Client, type Frame, type Message } from '@stomp/stompjs';
import { MapContainer, TileLayer, Popup, Marker, Polyline } from 'react-leaflet';
import { MapPin, Bus as BusIcon } from 'lucide-react';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';
import Cookies from 'js-cookie';
import { baseUrlStock } from '~/APIs/axios';
import useLanguageStore from '~/APIs/store';
import Container from '~/_components/Container';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';

// ============================
// Type Definitions
// ============================
interface BusLocation {
  message?: string;
  busId: number;
  longitude: number;
  latitude: number;
}

interface RawBusData {
  message: string;
  data: {
    id: number;
    longitude: number;
    latitude: number;
  };
}

// ============================
// Custom Marker Icon
// ============================
const createCustomMarkerIcon = (color: string) => {
  const iconHtml = renderToString(
    <div className="relative">
      <MapPin size={32} color={color} fill={color} fillOpacity={0.2} />
      <div className="absolute bottom-0 left-1/2 w-px h-px bg-transparent" />
    </div>
  );

  return divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// ============================
// Bus Component
// ============================
const Bus: React.FC = () => {
  // STOMP connection and location states
  const [connected, setConnected] = useState<boolean>(false);
  const [busId, setBusId] = useState<string>("1");
  const [busLocation, setBusLocation] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const token = Cookies.get('token');
  const language = useLanguageStore((state) => state.language);

  // ----------------------------
  // 1. Get User's Current Location
  // ----------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          console.log("Current location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // ----------------------------
  // 2. Connect via STOMP and subscribe to bus location updates
  // ----------------------------
  useEffect(() => {
    const client = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      debug: (str: string) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: Frame) => {
      setConnected(true);
      console.log('Connected:', frame);

      try {
        client.subscribe(`/topic/bus-location/${busId}`, (message: Message) => {
          const rawData: RawBusData = JSON.parse(message.body);
          const data: BusLocation = {
            message: rawData.message,
            busId: rawData.data.id,
            longitude: rawData.data.longitude,
            latitude: rawData.data.latitude,
          };
          // Update bus location state with [latitude, longitude]
          setBusLocation([data.latitude, data.longitude]);
          console.log("Received bus location:", data.latitude, data.longitude);
        });
      } catch (error) {
        console.error('Error in subscription:', error);
      }
    };

    client.onWebSocketError = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    client.onStompError = (frame: Frame) => {
      console.error('Broker error:', frame.headers.message, frame.body);
    };

    setStompClient(client);
    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [busId, token]);

  // ----------------------------
  // 3. Fetch Route from Current Location to Bus Location
  // ----------------------------
  useEffect(() => {
    if (!currentLocation || !busLocation) return;

    const fetchRoute = async () => {
      // API key and URL for LocationIQ Directions API
      const apiKey = 'pk.d807ad8f5a3c9654c978548059f91986';
      const [startLat, startLng] = currentLocation;
      const [destLat, destLng] = busLocation;
      const url = `https://us1.locationiq.com/v1/directions/driving/${startLng},${startLat};${destLng},${destLat}?key=${apiKey}&geometries=polyline`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch route");
        }
        const data = await response.json();
        const polylineString = data.routes[0].geometry;
        // Decode the polyline string into an array of [lat, lng] points
        const decodedPoints: [number, number][] = polyline
          .decode(polylineString)
          .filter((point: number[]): point is [number, number] => 
            point.length >= 2 && 
            typeof point[0] === 'number' && 
            typeof point[1] === 'number'
          );
        setRoutePoints(decodedPoints);
        console.log(`Route updated with ${decodedPoints.length} points.`);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [currentLocation, busLocation]);

  // ----------------------------
  // 4. Optional: Connect/Disconnect Handlers
  // ----------------------------
  const connect = useCallback(() => {
    if (stompClient && !connected) {
      stompClient.activate();
    }
  }, [stompClient, connected]);

  const disconnect = useCallback(() => {
    if (stompClient && connected) {
      stompClient.deactivate();
      setConnected(false);
      setBusLocation(null);
      setRoutePoints([]);
    }
  }, [stompClient, connected]);

  // ----------------------------
  // 5. Render the Map
  // ----------------------------
  // Use current location if available; otherwise fall back to a default
  const defaultPosition: [number, number] = currentLocation || [29.261243, -9.873053];

  return (
    <Container>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-bgPrimary rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BusIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-textSecondary">
              {language === 'fr'
                ? 'Suivi de localisation des bus'
                : language === 'ar'
                ? 'تعقب موقع الحافلة'
                : 'Bus Location Tracker'}
            </h1>
          </div>

          <div className="mb-6 space-x-4">
            <button
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                connected 
                  ? 'bg-bgSecondary cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              onClick={connect}
              disabled={connected}
            >
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-gray-400' : 'bg-green-400'}`} />
              {language === 'fr'
                ? 'Connecter'
                : language === 'ar'
                ? 'توصيل'
                : 'Connect'}
            </button>
            <button
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                !connected 
                  ? 'bg-bgSecondary cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              onClick={disconnect}
              disabled={!connected}
            >
              <div className={`w-2 h-2 rounded-full ${!connected ? 'bg-gray-400' : 'bg-red-400'}`} />
              {language === 'fr'
                ? 'Déconnecter'
                : language === 'ar'
                ? 'فصل'
                : 'Disconnect'}
            </button>
          </div>

          {/* Bus ID input (optional; you can remove if not needed) */}
          <div className="mb-4">
            <input
              type="text"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              className="w-full border border-borderPrimary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                language === 'fr'
                  ? "Entrez l'ID du bus"
                  : language === 'ar'
                  ? 'أدخل معرف الحافلة'
                  : 'Enter Bus ID'
              }
            />
          </div>

          <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
            <MapContainer center={defaultPosition} zoom={15} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Draw the route polyline if available */}
              {routePoints.length > 0 && (
                <Polyline positions={routePoints} color="blue" weight={4} />
              )}

              {/* Marker for the user's current location */}
              {currentLocation && (
                <Marker position={currentLocation} icon={createCustomMarkerIcon('#00ff00')}>
                  <Popup>
                    {language === 'fr'
                      ? 'Votre position'
                      : language === 'ar'
                      ? 'موقعك'
                      : 'Your Location'}
                  </Popup>
                </Marker>
              )}

              {/* Marker for the bus location */}
              {busLocation && (
                <Marker position={busLocation} icon={createCustomMarkerIcon('#ff0000')}>
                  <Popup>
                    {language === 'fr'
                      ? 'Localisation du bus'
                      : language === 'ar'
                      ? 'موقع الحافلة'
                      : 'Bus Location'}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Bus;
