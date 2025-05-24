// app/api/autocomplete/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { input } = await req.json();

    if (!input || input.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const route = "/places/v1/autocomplete";
    const url = `${process.env.OLA_BASE_URL}${route}`;

    const response = await axios.get(url, {
      params: {
        input,
        api_key: process.env.OLA_API_KEY,
      },
    });

    const predictions = response.data?.predictions || response.data?.results || [];

    const result = predictions.map((prediction) => ({
      id: prediction.place_id,
      primaryName: prediction.structured_formatting?.main_text || "",
      secondaryName: prediction.structured_formatting?.secondary_text || "",
      location: prediction.geometry?.location
        ? [prediction.geometry.location.lat, prediction.geometry.location.lng]
        : [null, null],
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json({ success: false, error: "Autocomplete failed" }, { status: 500 });
  }
}
