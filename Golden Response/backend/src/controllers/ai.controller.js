// Weather - NO API KEY NEEDED
async function getWeather(city) {
  try {
    console.log("Fetching weather for:", city);
    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    console.log("Weather response status:", res.status);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current_condition[0];
    return `Weather in ${city}: ${current.temp_C}°C, feels like ${current.FeelsLikeC}°C, ${current.weatherDesc[0].value}. Humidity: ${current.humidity}%, Wind: ${current.windspeedKmph} km/h.`;
  } catch (e) {
    console.log("Weather error:", e.message);
    return null;
  }
}

// News - newsapi.org
async function getNews(query) {
  try {
    const key = process.env.NEWS_API_KEY;
    if (!key) return null;
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.articles?.length) return "No news found.";
    return data.articles
      .map((a, i) => `${i + 1}. ${a.title} (${a.source.name})`)
      .join("\n");
  } catch (e) {
    console.log("News error:", e.message);
    return null;
  }
}

// Intent detect karo
function detectIntent(message) {
  const msg = message.toLowerCase();

  const weatherWords = [
    "weather", "wether", "mausam", "temperature", "temp", "baarish",
    "rain", "sunny", "humid", "wind", "forecast", "garmi", "sardi",
    "thand", "dhoop", "aaj ka", "today ka", "barish"
  ];

  const newsWords = [
    "news", "khabar", "latest", "headline", "breaking",
    "current", "aaj kya", "today"
  ];

  const isWeather = weatherWords.some((w) => msg.includes(w));
  const isNews = newsWords.some((w) => msg.includes(w));

  // City extract karo
  let city = null;
  if (isWeather) {
    const commonCities = [
      "delhi", "mumbai", "bangalore", "bengaluru", "noida", "hyderabad",
      "chennai", "kolkata", "pune", "jaipur", "lucknow", "agra", "surat",
      "gurgaon", "gurugram", "chandigarh", "ahmedabad", "bhopal", "patna",
      "london", "new york", "tokyo", "paris", "dubai", "singapore"
    ];
    city = commonCities.find((c) => msg.includes(c)) || null;

    // Agar city nahi mili to extract karne ki koshish karo
    if (!city) {
      const match = msg.match(/(?:in|at|for|of|mein|ka|ki)\s+([a-zA-Z\s]+?)(?:\s+weather|\s+wether|\s+mausam|$|\?)/i);
      if (match) city = match[1].trim();
    }

    // Default city Delhi
    if (!city) city = "Delhi";
  }

  // News query extract karo
  let newsQuery = "india";
  if (isNews) {
    const cleaned = message
      .replace(/news|khabar|latest|today|headline|breaking|batao|bolo/gi, "")
      .trim();
    if (cleaned.length > 2) newsQuery = cleaned;
  }

  return { isWeather, isNews, city, newsQuery };
}

export async function aiChat(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array required" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        reply: "⚠️ AI configure nahi hua. GEMINI_API_KEY .env mein add karo.",
      });
    }

    // Last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUserMsg?.content || "";

    // Intent detect karo
    const { isWeather, isNews, city, newsQuery } = detectIntent(userText);

    // Live data fetch karo
    let extraContext = "";

    if (isWeather && city) {
      const weatherData = await getWeather(city);
      if (weatherData) {
        extraContext += `\n\n[LIVE WEATHER DATA - Use this to answer]: ${weatherData}`;
      } else {
        extraContext += `\n\n[WEATHER]: Could not fetch weather for ${city}. Tell user to try again.`;
      }
    }

    if (isNews) {
      const newsData = await getNews(newsQuery);
      if (newsData) {
        extraContext += `\n\n[LIVE NEWS DATA - Use this to answer]:\n${newsData}`;
      }
    }

    const systemMsg = `You are a friendly AI assistant for the Streamify language learning app. You help users with:
- Language learning, grammar, translations, pronunciation
- Real-time weather information (IMPORTANT: if [LIVE WEATHER DATA] is provided below, use it to answer weather questions accurately)
- Latest news and current events (IMPORTANT: if [LIVE NEWS DATA] is provided below, use it to answer news questions)
- General knowledge and questions

Always reply in the same language the user writes in. Be concise, warm and helpful.
${extraContext}`;

    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemMsg }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(200).json({
        success: true,
        reply: `AI error: ${errData?.error?.message || "Unknown"}`,
      });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, response nahi aaya.";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("AI chat error:", error.message);
    res.status(200).json({
      success: true,
      reply: "Network error. Backend restart karo.",
    });
  }
}