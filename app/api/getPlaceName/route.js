// app/api/place/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { location } = await req.json();
    const [lat, lng] = location;
    const combinedLocation = `${lat}%2C${lng}`;
    const route = "/places/v1/nearbysearch";

    const url = `${process.env.OLA_BASE_URL}${route}?location=${combinedLocation}&api_key=${process.env.OLA_API_KEY}`;
    const response = await axios.get(url);

    const predictions = response.data?.predictions ?? [];

    if (predictions.length === 0) {
      return NextResponse.json({ success: false, error: "No place found" }, { status: 404 });
    }

    const place = predictions[0];
    const terms = [];

    for (const term of place.terms || []) {
      if (term.offset > 100) break;
      if (term.offset > 50 && term.offset < 100 && term.value !== "[no Name]") {
        terms.push({ value: term.value, offset: term.offset });
      }
    }

    const result = {
      placeId: place.place_id,
      terms,
      placeName: place.structured_formatting?.main_text || "",
      address: place.structured_formatting?.secondary_text || "",
      location: [lat, lng],
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching place name:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch place name" }, { status: 500 });
  }
}
