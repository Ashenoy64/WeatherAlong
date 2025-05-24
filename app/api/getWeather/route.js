// app/api/weather/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { location } = await req.json();

    const url = `${process.env.WEATHER_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location[0]},${location[1]}&days=2&aqi=no&alerts=no`;

    const response = await axios.get(url);
    if (
      response.data &&
      response.data.forecast &&
      response.data.forecast.forecastday.length > 0
    ) {
      return NextResponse.json({
        success: true,
        data: response.data.forecast.forecastday[0].hour,
      });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch weather" }, { status: 500 });
  }

  return NextResponse.json({ success: false, error: "No data" }, { status: 400 });
}
