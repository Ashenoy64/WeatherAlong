import axios from "axios";


async function getWeather(location) {
    const route = 'forecast.json'
    const url = `${process.env.WEATHER_BASE_URL}${route}?key=${process.env.WEATHER_API_KEY}&q=${location[0]},${location[1]}&days=1&aqi=no&alerts=no`
    try {
        const response = await axios.get(url)
        if (response.data && response.data.forecast && response.data.forecast.forecastday.length > 0) {
            const forecast = response.data.forecast.forecastday[0]
            return forecast.hour
        }
    }
    catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
    finally {
        return null
    }
}


async function getWeatherByTime(location, time) {
    try {
        const hourly = await getWeather(location)
        if (hourly && hourly.length > 0) {
            const inputDate = new Date(time);

            // Get minutes of input time
            const inputMinutes = inputDate.getMinutes();

            // If input minutes >= 45, round up to next hour
            let targetHour = inputDate.getHours();
            if (inputMinutes >= 45) {
                targetHour += 1;
            }

            // Find the hour that matches the rounded hour
            for (const hour of hourly) {
                const hourDate = new Date(hour.time);
                if (hourDate.getHours() === targetHour && hourDate.getDate() === inputDate.getDate()) {
                    return hour;
                }
            }
        }
    }
    catch (error) {
        console.error('Error fetching weather by time:', error);
        throw error;
    }
    finally {
        return null
    }
}

export {
    getWeather,
    getWeatherByTime,
}