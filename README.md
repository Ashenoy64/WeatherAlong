# 🌤️ Weather Along Route

A web app built with **Next.js** that helps users visualize weather forecasts along a travel route. Whether you're commuting, planning a road trip, or cycling across town, this tool provides weather insights **at multiple points along your path**, not just at the start or end.


## 🚀 Features

- 🔍 **Smart Location Input**  
  - Autocomplete search for source and destination  
  - Option to manually enter coordinates (lat,lng)

- 🧭 **Route-Based Weather Insights**  
  - View weather updates at intervals along your route  
  - Segment the route by **distance** or **time**

- 🕒 **Time-Aware Forecasting**  
  - Choose a start time (today only) to get future weather forecasts for each segment

- 🧠 **CAPTCHA Validation**  
  - Integrated invisible reCAPTCHA v2 to protect API access

- 🌐 **OLA Maps Integration**  
  - Fetches routes and place names using OLA Maps APIs


## 📦 Installation

```bash
git clone https://github.com/your-username/weather-along-route.git
cd weather-along-route
npm install
````

### 🔐 Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET=your_recaptcha_secret
OLA_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key
OLA_BASE_URL=https://api.olamaps.io
WEATHER_BASE_URL= http://api.weatherapi.com/v1
DEBOUNCE_TIMEOUT=300
URL=url-site-url
```

> Make sure your Google API key has both Places API and Directions API enabled.

---

## 💻 Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — © 2025 Avanish Shenoy


