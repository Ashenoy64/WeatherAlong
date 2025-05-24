import Image from "next/image";

// Formatting helpers
function formatDistance(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

function formatDuration(baseTime, durationMs) {
  const targetTime = new Date(baseTime + durationMs);
  const diffMinutes = Math.round(durationMs / 60000);
  return `+${diffMinutes} min (${targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
}

export default function WeatherAlongRoute({ weatherAlong, selectedRouteIdx, startTime = Date.now() }) {
  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {weatherAlong[selectedRouteIdx].map((area, index) => (
        <div
          key={index}
          className="bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-3 transition transform hover:scale-[1.02]"
        >
          {/* Header: Location and Weather Icon */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-indigo-700">
                {area.placeName || "Unknown Location"}
              </h2>
              <p className="text-sm text-gray-500">{area.address}</p>
            </div>
            <Image
              width={48}
              height={48}
              src={`https:${area.weather.condition.icon}`}
              alt={area.weather.condition.text}
              className="w-12 h-12"
            />
          </div>

          {/* Weather Info */}
          <div className="text-sm text-gray-800 space-y-1">
            <p><strong>Temperature:</strong> {area.weather.temp_c}°C</p>
            <p><strong>Condition:</strong> {area.weather.condition.text}</p>
            <p><strong>Humidity:</strong> {area.weather.humidity}%</p>
            <p><strong>Chance of Rain:</strong> {area.weather.chance_of_rain}%</p>
            <p><strong>Wind:</strong> {area.weather.wind_kph} kph {area.weather.wind_dir}</p>
          </div>

          {/* Route Info */}
          <div className="text-xs text-gray-600 mt-2 border-t pt-2">
            <p><strong>Distance:</strong> {formatDistance(area.distance)}</p>
            <p><strong>ETA:</strong> {formatDuration(startTime, area.duration * 1000)}</p>
            <p><strong>Forecast Time:</strong> {area.weather.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
