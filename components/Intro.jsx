import Image from "next/image";
import { CloudSun, Info } from "lucide-react";

export default function WeatherIntro() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto text-gray-800 mb-8">
      {/* Preview Image */}
      <Image
        src="/preview.jpg"
        alt="Weather Along preview"
        width={1200}
        height={630}
        className="rounded-xl mb-6"
        priority
      />

      {/* Intro Text */}
      <div className="flex items-center gap-3 mb-4">
        <CloudSun className="text-indigo-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-indigo-700">
          Welcome to Weather Along
        </h2>
      </div>
      <p className="mb-3">
        Planning a road trip or heading to a new city? Don’t just check the
        weather at your destination—see what it’ll be like{" "}
        <strong>along your entire journey</strong>! 🚗🌦️
      </p>
      <p className="mb-3">
        <strong>Weather Along</strong> gives you detailed weather updates for
        key points on your route, based on either <em>distance</em> or{" "}
        <em>time intervals</em>.
      </p>

      {/* Instructions Box */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 text-sm text-indigo-900 p-3 rounded-md">
        <Info className="inline-block w-4 h-4 mr-2" />
        <strong>How to Use:</strong>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            Enter your <strong>source</strong> and <strong>destination</strong>{" "}
            — either by name or coordinates.
          </li>
          <li>
            Select a <strong>start time</strong> for your trip (today only).
          </li>
          <li>
            Choose to divide your route by <strong>distance</strong> or{" "}
            <strong>time</strong>.
          </li>
          <li>
            Click <em>“Get Weather Along Route”</em> and see the weather
            forecast at key points.
          </li>
        </ul>
      </div>
    </div>
  );
}
