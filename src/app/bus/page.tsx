"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Client, type Frame, type Message } from "@stomp/stompjs";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Polyline,
  useMap,
  Tooltip,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import { MapPin, Bus as BusIcon } from "lucide-react";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import Cookies from "js-cookie";
import { baseUrlStock } from "~/APIs/axios";
import useLanguageStore from "~/APIs/store";
import Container from "~/_components/Container";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import { useBusInfo } from "~/APIs/hooks/useBus";
import { Skeleton } from "~/components/ui/Skeleton";
import Button from "~/_components/Button";
import { IoClose, IoEye } from "react-icons/io5";

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
      <div className="absolute bottom-0 left-1/2 h-px w-px bg-transparent" />
    </div>,
  );

  return divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const calculateDistanceKm = (
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number],
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const AutoZoom = ({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([from, to], { padding: [50, 50] });
  }, [from, to, map]);

  return null;
};

// ============================
// Bus Component
// ============================
const Bus: React.FC = () => {
  const [showUpdatesPanel, setShowUpdatesPanel] = useState(true);
  // STOMP connection and location states
  const [connected, setConnected] = useState<boolean>(false);
  const [busId, setBusId] = useState<string>("");
  const [busLocation, setBusLocation] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const token = Cookies.get("token");
  const language = useLanguageStore((state) => state.language);
  const [messages, setMessages] = useState<BusLocation[]>([]);
  const busIdNumber = parseInt(busId);
  const { data: busInfo, isLoading: isBusLoading } = useBusInfo(
    connected && busId ? busIdNumber : undefined,
  );

  useEffect(() => {
    console.log("Current:", currentLocation, "Bus:", busLocation);
  }, [currentLocation, busLocation]);

  // get height of screen
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
  };

  const LocationMarker: React.FC<{
    onLocationSelect: (lat: number, lng: number) => void;
    position: [number, number] | null;
  }> = ({ onLocationSelect, position }) => {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });

    return position ? (
      <Marker position={position} icon={createCustomMarkerIcon("#e84743")}>
        <Popup>Bus Location</Popup>
      </Marker>
    ) : null;
  };

  // ----------------------------
  // 1. Get User's Current Location
  // ----------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          console.log(
            "Current location:",
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
      );
    } else {
      console.error(
        "Geolocation isuseStudentBusId not supported by this browser.",
      );
    }
  }, []);

  // ----------------------------
  // 2. Connect via STOMP and subscribe to bus location updates
  // ----------------------------
  useEffect(() => {
    if (!busId || !token) return;
    const client = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      debug: (str: string) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: Frame) => {
      setConnected(true);
      console.log("Connected:", frame);

      try {
        client.subscribe(`/topic/bus-location/${busId}`, (message: Message) => {
          console.log("🔴 Bus message received:", message);
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
        console.error("Error in subscription:", error);
      }
    };

    client.onWebSocketError = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    client.onStompError = (frame: Frame) => {
      console.error("Broker error:", frame.headers.message, frame.body);
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
    if (!currentLocation || !busLocation) {
      console.log("Skipping route fetch: Missing locations");
      return;
    }

    const fetchRoute = async () => {
      const apiKey = "pk.d807ad8f5a3c9654c978548059f91986";
      const [startLat, startLng] = currentLocation;
      const [destLat, destLng] = busLocation;
      const url = `https://us1.locationiq.com/v1/directions/driving/${startLng},${startLat};${destLng},${destLat}?key=${apiKey}&geometries=polyline`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Route API Response:", data);

        const polylineString = data.routes[0]?.geometry;
        const decodedPoints = polyline
          .decode(polylineString)
          .filter((point): point is [number, number] => point.length >= 2);

        setRoutePoints(decodedPoints);
        console.log("Decoded polyline points:", decodedPoints);
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
    if (stompClient && !connected && busId) {
      stompClient.activate();
    }
  }, [stompClient, connected, busId]);

  const disconnect = useCallback(() => {
    if (stompClient && connected) {
      stompClient.deactivate();
      setConnected(false);
      setBusLocation(null);
      setRoutePoints([]);
    }
  }, [stompClient, connected]);

  // dummy data
  const addMessage = (data: BusLocation) => {
    setMessages((prev) => [...prev, data]);
  };

  useEffect(() => {
    if (connected && messages.length === 0) {
      addMessage({
        busId: Number(busId),
        latitude: 30.0444,
        longitude: 31.2357,
      });
    }
  }, [connected]);

  // ----------------------------
  // 5. Render the Map
  // ----------------------------
  // Use current location if available; otherwise fall back to a default
  const defaultPosition: [number, number] = currentLocation || [
    29.261243, -9.873053,
  ];

  return (
    <Container>
      <div className="mx-auto w-full px-2">
        <div className="rounded-lg bg-bgPrimary p-6 shadow-lg">
          <div className="mb-6 flex justify-between space-x-4">
            <div className="">
              <input
                type="text"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="w-full rounded-lg border border-borderPrimary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  language === "fr"
                    ? "Entrez l'ID du bus"
                    : language === "ar"
                      ? "أدخل معرف الحافلة"
                      : "Enter Bus ID"
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <button
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2 font-semibold transition-colors duration-200 ${
                  connected
                    ? "cursor-not-allowed bg-bgSecondary"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={connect}
                disabled={connected}
              >
                <div
                  className={`h-2 w-2 rounded-full ${connected ? "bg-gray-400" : "bg-green-400"}`}
                />
                {language === "fr"
                  ? "Connecter"
                  : language === "ar"
                    ? "توصيل"
                    : "Connect"}
              </button>
              <button
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2 font-semibold transition-colors duration-200 ${
                  !connected
                    ? "cursor-not-allowed bg-bgSecondary"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                onClick={disconnect}
                disabled={!connected}
              >
                <div
                  className={`h-2 w-2 rounded-full ${!connected ? "bg-gray-400" : "bg-red-400"}`}
                />
                {language === "fr"
                  ? "Déconnecter"
                  : language === "ar"
                    ? "فصل"
                    : "Disconnect"}
              </button>
            </div>
          </div>

          {/* Bus ID input (optional; you can remove if not needed) */}
          <div className="mb-4"></div>

          <div
            style={{ height: screenHeight - 240 }}
            className="relative overflow-hidden rounded-lg border border-gray-300"
          >
            <MapContainer
              center={defaultPosition}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={createCustomMarkerIcon("#4ade80")}
                >
                  <Popup>
                    {language === "ar"
                      ? "موقعي"
                      : language === "fr"
                        ? "Ma position"
                        : "My Location"}
                  </Popup>
                </Marker>
              )}
              {busLocation && (
                <Marker
                  position={busLocation}
                  icon={createCustomMarkerIcon("#ff0000")}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    {language === "fr"
                      ? "Bus"
                      : language === "ar"
                        ? "الحافلة"
                        : "Bus"}
                  </Tooltip>
                </Marker>
              )}
              {busLocation && (
                <CircleMarker
                  center={busLocation}
                  radius={10}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.4,
                  }}
                />
              )}

              {currentLocation && messages.length > 0 && (
                <>
                  <Polyline
                    positions={[
                      currentLocation,
                      [
                        messages[messages.length - 1]?.latitude ?? 0,
                        messages[messages.length - 1]?.longitude ?? 0,
                      ],
                    ]}
                    color="blue"
                    weight={5}
                    dashArray="6"
                  />
                  <AutoZoom
                    from={currentLocation}
                    to={[
                      messages[messages.length - 1]?.latitude ?? 0,
                      messages[messages.length - 1]?.longitude ?? 0,
                    ]}
                  />
                </>
              )}
              <LocationMarker
                onLocationSelect={handleLocationSelect}
                position={markerPosition}
              />
            </MapContainer>

            {connected && (
              <button
                onClick={() => setShowUpdatesPanel(!showUpdatesPanel)}
                className="absolute right-7 top-7 z-[1100] flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg transition hover:bg-primaryHover"
              >
                {showUpdatesPanel ? (
                  <IoClose className="h-5 w-5" />
                ) : (
                  <IoEye className="h-4 w-4" />
                )}
              </button>
            )}
            {connected && showUpdatesPanel && (
              <div
                style={{ maxHeight: screenHeight - 260 }}
                className="absolute right-5 top-5 z-[1000] w-[300px] rounded-lg bg-bgPrimary p-4"
              >
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-textPrimary">
                  <MapPin className="h-5 w-5 text-primary" />
                  {language === "fr"
                    ? "Mises à jour de localisation"
                    : language === "ar"
                      ? "تحديثات الموقع"
                      : "Location Updates"}
                </h2>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-borderPrimary bg-bgPrimary p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 font-medium text-textPrimary">
                        <BusIcon className="h-4 w-4 text-primary" />
                        {language === "fr"
                          ? `ID de bus : ${msg.busId}`
                          : language === "ar"
                            ? `رقم معرف الحافلة: ${msg.busId}`
                            : `Bus ID: ${msg.busId}`}
                      </div>
                      {msg.message && (
                        <div className="mb-2 pl-6 text-gray-600">
                          {msg.message}
                        </div>
                      )}
                      <div className="pl-6 text-gray-600">
                        {language === "fr"
                          ? `Longitude : ${msg.longitude.toFixed(6)}\nLatitude : ${msg.latitude.toFixed(6)}`
                          : language === "ar"
                            ? `الخط الطولي: ${msg.longitude.toFixed(6)}\nالعرض: ${msg.latitude.toFixed(6)}`
                            : `Longitude: ${msg.longitude.toFixed(6)}\nLatitude: ${msg.latitude.toFixed(6)}`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3">
                  {isBusLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : busInfo ? (
                    <>
                      <p>
                        <strong>Driver Name:</strong> {busInfo.driverName}
                      </p>
                      <p>
                        <strong>Bus No.:</strong> {busInfo.busNumber}
                      </p>
                      <p>
                        <strong>Bus Speed:</strong> {busInfo.speed} km/h
                      </p>
                      <p>
                        <strong>Phone:</strong> +
                        {busInfo.phoneNumber.countryCode}{" "}
                        {busInfo.phoneNumber.nationalNumber}
                      </p>

                      <Button
                        className="mt-4"
                        onClick={() => {
                          window.open(
                            `tel:+${busInfo.phoneNumber.countryCode}${busInfo.phoneNumber.nationalNumber}`,
                          );
                        }}
                      >
                        Call Driver
                      </Button>
                    </>
                  ) : (
                    <p>No bus info available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Bus;
