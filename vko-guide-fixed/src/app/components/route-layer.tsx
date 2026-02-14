import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface RouteLayerProps {
  start: [number, number];
  end: [number, number];
}

// OpenRouteService API для построения маршрутов по дорогам
// Это бесплатный API, не требующий ключа для ограниченного использования
export const RouteLayer: React.FC<RouteLayerProps> = ({ start, end }) => {
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        // Используем публичный OSRM API (Open Source Routing Machine)
        // Формат: {longitude},{latitude} (обратите внимание на порядок!)
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          // Конвертируем координаты из GeoJSON формата в Leaflet формат
          const coords: LatLngExpression[] = data.routes[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]] as LatLngExpression
          );
          setRouteCoords(coords);
        } else {
          // Если маршрут не найден, используем прямую линию как fallback
          console.warn("Route not found, using straight line");
          setRouteCoords([start, end]);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        // Fallback на прямую линию при ошибке
        setRouteCoords([start, end]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  if (!routeCoords) {
    return null;
  }

  return (
    <>
      {/* Основная линия маршрута */}
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: "#16a34a",
          weight: 5,
          opacity: 0.8,
        }}
      />
      {/* Обводка для лучшей видимости */}
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: "#ffffff",
          weight: 7,
          opacity: 0.4,
        }}
      />
      {/* Анимированная пунктирная линия сверху */}
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: "#22c55e",
          weight: 3,
          opacity: loading ? 0.3 : 1,
          dashArray: "10, 15",
          lineCap: "round",
        }}
      />
    </>
  );
};
