// app/api/directions/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { source, destination } = await req.json();

    const route = '/routing/v1/directions';
    const combinedSource = `${source[0]}%2C${source[1]}`;
    const combinedDestination = `${destination[0]}%2C${destination[1]}`;

    const url = `${process.env.OLA_BASE_URL}${route}?origin=${combinedSource}&destination=${combinedDestination}&api_key=${process.env.OLA_API_KEY}`;

    const response = await axios.post(url);
    const routes = response.data.routes;

    const waypoints= [];

    if (Array.isArray(routes) && routes.length > 0) {
      for (const route of routes) {
        const legs = route.legs || [];
        const routeWaypoint = [];

        for (const leg of legs) {
          const steps = leg.steps || [];
          for (const step of steps) {
            routeWaypoint.push({
              source: [step.start_location.lat, step.start_location.lng],
              destination: [step.end_location.lat, step.end_location.lng],
              duration: step.duration,
              distance: step.distance,
              instruction: step.instructions,
            });
          }
        }

        waypoints.push(routeWaypoint);
      }
    }

    return NextResponse.json({ success: true, data: waypoints });
  } catch (error) {
    console.error("Error fetching directions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch directions" }, { status: 500 });
  }
}
