
async function getWeather(location) {
  try {
    const res = await fetch("/api/getWeather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    });
    const data = await res.json();
    if (data.success) return data.data;
    console.error("API error", data.error);
  } catch (err) {
    console.error("Client fetch failed", err);
  }
  return null;
}

async function getWeatherByTime(location, time) {
  try {
    const hourly = await getWeather(location);
    if (hourly && hourly.length > 0) {
      const inputDate = new Date(time);
      let targetHour = inputDate.getHours();
      if (inputDate.getMinutes() >= 45) {
        targetHour += 1;
      }

      for (const hour of hourly) {
        const hourDate = new Date(hour.time);
        if (
          hourDate.getHours() === targetHour &&
          hourDate.getDate() === inputDate.getDate()
        ) {
          return hour;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching weather by time:", error);
    throw error;
  }

  return null; // Moved outside finally
}

export { getWeather, getWeatherByTime };
