
export async function getDirections(source, destination) {
  try {
    const res = await fetch("/api/getDirection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, destination }),
    });

    const data = await res.json();
    if (data.success) return data.data;
    console.error("Direction API error", data.error);
  } catch (err) {
    console.error("Client fetch failed", err);
  }

  return [];
}


export async function getPlaceName(location) {
  try {
    const res = await fetch("/api/getPlaceName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    });

    const data = await res.json();
    if (data.success) return data.data;

    console.error("Place API error", data.error);
  } catch (err) {
    console.error("Client fetch failed", err);
  }

  return null;
}

