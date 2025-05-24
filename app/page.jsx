"use client";
import WeatherIntro from "@/components/Intro";
import { useState, useEffect, useRef } from "react";
import {
  getAutoComplete,
  getAreaAlongDistance,
  getAreaAlongTime,
} from "@/lib/utils";
import { getDirections, getPlaceName } from "@/lib/navigation";
import { getWeatherByTime } from "@/lib/weather";
import WeatherAlongRoute from "@/components/WeatherAlong";
import { CheckCircle, MapPinned } from "lucide-react";
import Captcha from "react-google-recaptcha";

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        const result = await fn.apply(this, args);
        resolve(result);
      }, delay);
    });
  };
}

const debouncedAutoComplete = debounce(async (query) => {
  if (!query) return [];
  try {
    const results = await getAutoComplete(query);
    return results || [];
  } catch {
    return [];
  }
}, 300);

export default function Home() {
  const [source, setSource] = useState({
    name: "",
    loc: null,
    selected: false,
  });
  const [destination, setDestination] = useState({
    name: "",
    loc: null,
    selected: false,
  });

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [useCoordsSource, setUseCoordsSource] = useState(false);
  const [useCoordsDest, setUseCoordsDest] = useState(false);

  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [weatherAlong, setWeatherAlong] = useState([]);
  const [divisionType, setDivisionType] = useState("distance");
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // "HH:MM"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recaptchaRef = useRef();
  const sourceRef = useRef();
  const destRef = useRef();

  useEffect(() => {
    if (useCoordsSource || source.name.length < 2) return;
    debouncedAutoComplete(source.name).then(setSourceSuggestions);
  }, [source.name, useCoordsSource]);

  useEffect(() => {
    if (useCoordsDest || destination.name.length < 2) return;
    debouncedAutoComplete(destination.name).then(setDestinationSuggestions);
  }, [destination.name, useCoordsDest]);

  const handleNameInput = (e, setter, setSuggestions) => {
    const val = e.target.value;
    setter((prev) => ({ ...prev, name: val, selected: false }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sourceRef.current &&
        !sourceRef.current.contains(e.target) &&
        destRef.current &&
        !destRef.current.contains(e.target)
      ) {
        setSourceSuggestions([]);
        setDestinationSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCoordInput = (e, setter) => {
    const val = e.target.value;
    const [lat, lng] = val.split(",").map(Number);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setter({ name: val, loc: [lat, lng], selected: true });
    } else {
      setter({ name: val, loc: null, selected: false });
    }
  };

  const handleSelect = (suggestion, setter) => {
    setter({
      name: suggestion.primaryName,
      loc: suggestion.location,
      selected: true,
    });
  };

const handleCaptcha = async () => {
  try {
    const recaptchaResponse = await recaptchaRef.current?.executeAsync();

    if (!recaptchaResponse) return false;

    recaptchaRef.current.reset();

    const response = await fetch("/api/validatePathToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recaptchaResponse }),
    });

    const data = await response.json();

    return data.success === true;
  } catch (err) {
    console.error("Captcha error:", err);
    return false;
  }
};


  const handleWeatherAlong = async () => {
    if (!source.loc || !destination.loc) {
      setError("⚠️ Please enter valid source and destination.");
      return;
    }
    if (!source.selected || !destination.selected) {
      setError(
        "⚠️ Please select valid source and destination before submitting."
      );
      return;
    }

    const captchaValid = await handleCaptcha();
    if (!captchaValid) {
      setError("⚠️ Captcha validation failed. Please try again.");
      return;
    }

    setError(""); // clear previous error
    setLoading(true);
    try {
      const directions = await getDirections(source.loc, destination.loc);
      const areas =
        divisionType === "time"
          ? getAreaAlongTime(directions, 3600)
          : getAreaAlongDistance(directions, 1000);
      const timeParts = time.split(":");
      const selectedTimestamp = new Date();
      selectedTimestamp.setHours(
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        0
      );

      const areasWeathers = [];
      for (const area of areas) {
        const areaWeather = [];
        for (const waypoint of area) {
          const weather = await getWeatherByTime(
            waypoint.destination,
            selectedTimestamp.getTime() + waypoint.duration * 1000
          );
          const placeName = await getPlaceName(waypoint.destination);
          areaWeather.push({ ...waypoint, weather, ...placeName });
        }
        areasWeathers.push(areaWeather);
      }
      setWeatherAlong(areasWeathers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  function getStartTime(timeStr) {
    const parts = timeStr.split(":");
    const now = new Date();
    now.setHours(parseInt(parts[0]), parseInt(parts[1]), 0);
    return now.getTime();
  }

  const renderInputBlock = (
    label,
    value,
    setFn,
    suggestions,
    setSuggestions,
    useCoords,
    setUseCoords
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={useCoords}
          onChange={() => {
            setUseCoords(!useCoords);
            setFn({ name: "", loc: null, selected: false });
            setSuggestions([]);
          }}
        />
        <span className="text-sm">Enter Coordinates (lat,lng)</span>
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md"
          placeholder={
            useCoords ? "eg: 19.07,72.87" : `Search ${label.toLowerCase()}`
          }
          value={value.name}
          onChange={(e) =>
            useCoords
              ? handleCoordInput(e, setFn)
              : handleNameInput(e, setFn, setSuggestions)
          }
        />
        {value.selected && (
          <CheckCircle className="absolute right-3 top-3 text-green-500 w-5 h-5" />
        )}
      </div>

      {!useCoords && !value.selected && suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 z-10 rounded-md shadow max-h-40 max-w-lg overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => handleSelect(s, setFn)}
            >
              {s.primaryName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gradient-to-tr from-blue-100 to-indigo-200 min-h-screen text-black">
      <WeatherIntro></WeatherIntro>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          <MapPinned className="inline mr-2 text-indigo-600" /> Plan Your
          Weather Route
        </h1>

        {/* Inputs */}
        {renderInputBlock(
          "Source",
          source,
          setSource,
          sourceSuggestions,
          setSourceSuggestions,
          useCoordsSource,
          setUseCoordsSource
        )}
        {renderInputBlock(
          "Destination",
          destination,
          setDestination,
          destinationSuggestions,
          setDestinationSuggestions,
          useCoordsDest,
          setUseCoordsDest
        )}

        {/* Time Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Time (Today Only):
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Divider selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Divide Route By:
          </label>
          <select
            value={divisionType}
            onChange={(e) => setDivisionType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="distance">Distance</option>
            <option value="time">Time</option>
          </select>
        </div>
        <div className="hidden">
          <Captcha
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          />
        </div>
        {/* Submit */}
        <button
          onClick={handleWeatherAlong}
          disabled={loading || !source.selected || !destination.selected}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Weather Along Route"}
        </button>
        {error && (
          <p className="mt-2 text-red-600 text-sm text-center">{error}</p>
        )}
        {/* Route selection if multiple */}
        {weatherAlong.length > 1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Route:
            </label>
            <select
              value={selectedRouteIdx}
              onChange={(e) => setSelectedRouteIdx(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md"
            >
              {weatherAlong.map((_, idx) => (
                <option key={idx} value={idx}>
                  Route {idx + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Weather Display */}
      {weatherAlong.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">
            Weather Details
          </h2>
          <WeatherAlongRoute
            weatherAlong={weatherAlong}
            selectedRouteIdx={selectedRouteIdx}
            startTime={getStartTime(time)}
          />
        </div>
      )}
    </div>
  );
}
