import axios from "axios";
import { getWeatherByTime } from "./weather"; // ← import needed!

function getAreaAlongTime(waypoints, time, segments = 4) {
  const areas = [];

  for (let waypoint of waypoints) {
    // Total duration of this route
    const totalDuration = waypoint.reduce((sum, step) => sum + step.duration, 0);

    // If time is null or greater than totalDuration, split into 'segments' parts
    const segmentTime = !time || time > totalDuration ? totalDuration / segments : time;

    let timeElapsed = 0;
    let cummulativeDistance = 0;
    let cummulativeTime = 0;
    let area = [];

    for (let step of waypoint) {
      timeElapsed += step.duration;
      cummulativeDistance += step.distance;
      cummulativeTime += step.duration;

      if (timeElapsed >= segmentTime) {
        area.push({
          destination: step.destination,
          duration: cummulativeTime,
          distance: cummulativeDistance,
        });
        timeElapsed = 0;
      }
    }

    // Add any leftover steps if not already added
    if (
      area.length === 0 ||
      area[area.length - 1].duration < totalDuration
    ) {
      area.push({
        destination: waypoint[waypoint.length - 1].destination,
        duration: cummulativeTime,
        distance: cummulativeDistance,
      });
    }

    areas.push(area);
  }

  return areas;
}


function getAreaAlongDistance(waypoints, distance) {
  const areas = [];

  for (let waypoint of waypoints) {
    let distanceElapsed = 0;
    let cummulativeDistance = 0;
    let cummulativeTime = 0;
    let area = [];

    for (let step of waypoint) {
      distanceElapsed += step.distance;
      cummulativeDistance += step.distance;
      cummulativeTime += step.duration;

      if (distanceElapsed >= distance) {
        area.push({
          destination: step.destination,
          duration: cummulativeTime,
          distance: cummulativeDistance,
        });
        distanceElapsed = 0;
      }
    }

    areas.push(area);
  }

  return areas;
}

// Proper async version
async function getAreaAndWeather(areas) {
  const areaWeather = [];

  for (const area of areas) {
    const areaResults = [];

    for (const point of area) {
      try {
        const weather = await getWeatherByTime(
          point.destination,
          Date.now() + point.duration
        );

        areaResults.push({
          ...point,
          weather,
        });
      } catch (err) {
        console.error("Failed to fetch weather for point:", point.destination, err);
      }
    }

    areaWeather.push(areaResults);
  }

  return areaWeather;
}

export async function getAutoComplete(input) {
  try {
    const res = await fetch("/api/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    if (data.success) return data.data;
    console.error("Autocomplete failed:", data.error);
  } catch (err) {
    console.error("Client autocomplete error:", err);
  }

  return [];
}

export {
  getAreaAlongTime,
  getAreaAlongDistance,
  getAreaAndWeather,
  getAutoComplete,
};
