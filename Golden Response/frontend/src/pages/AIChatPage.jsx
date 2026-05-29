import { useState, useRef, useEffect, useCallback } from "react";
import { axiosInstance } from "../lib/axios";
import { BotIcon, SendIcon, TrashIcon, UserIcon, SparklesIcon } from "lucide-react";

const WELCOME = {
  role: "assistant",
  content:
    "Hi! Main aapka AI assistant hoon 🌍\nMain aapki help kar sakta hoon:\n• Kisi bhi language mein practice karna\n• Grammar explain karna\n• Translation karna\n• Pronunciation tips dena\n• 🌤️ Real-time weather - 'Delhi ka mausam kaisa hai?'\n• 📰 Latest news - 'Aaj ki khabar batao'\n\nKuch bhi poochho!",
};

// Default quick suggestions (jab koi message nahi)
const DEFAULT_SUGGESTIONS = [
  "Translate 'Good morning' in Japanese 🇯🇵",
  "English grammar - when to use 'a' vs 'an'?",
  "French mein 1 se 10 tak numbers sikhao",
  "Mujhse English mein conversation practice karo",
  "Spanish mein common phrases batao",
  "Hindi to English translation practice",
];

const AIChatPage = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS.slice(0, 3));
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const suggestionTimerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI se smart suggestions fetch karo last message ke basis pe
  const fetchSuggestions = useCallback(async (chatMessages) => {
    const lastAssistantMsg = [...chatMessages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistantMsg || lastAssistantMsg === WELCOME) return;

    setIsSuggestionsLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        messages: [
          ...chatMessages,
          {
            role: "user",
            content:
              "Based on our conversation, give me exactly 3 short follow-up questions or messages I might want to send next. Return ONLY a JSON array of 3 strings, nothing else. Example: [\"Question 1?\", \"Question 2?\", \"Question 3?\"] Keep each under 8 words.",
          },
        ],
      });

      const raw = res.data.reply?.trim();
      const match = raw.match(/\[.*\]/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setSuggestions(parsed.slice(0, 3));
          setShowSuggestions(true);
        }
      }
    } catch (e) {
      // silently fail - suggestions optional hain
      console.log("Suggestions fetch failed:", e.message);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, []);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    // Suggestions hide karo jab message bheje
    setShowSuggestions(false);
    setSuggestions([]);

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/ai/chat", {
        messages: updatedMessages,
      });

      const finalMessages = [
        ...updatedMessages,
        { role: "assistant", content: res.data.reply },
      ];
      setMessages(finalMessages);

      // 800ms baad suggestions fetch karo
      clearTimeout(suggestionTimerRef.current);
      suggestionTimerRef.current = setTimeout(() => {
        fetchSuggestions(finalMessages);
      }, 800);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Sorry, abhi connect nahi ho pa raha. Thodi der baad try karo.";
      setMessages([...updatedMessages, { role: "assistant", content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setInput("");
    setSuggestions(DEFAULT_SUGGESTIONS.slice(0, 3));
    setShowSuggestions(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-base-200 border-b border-base-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <BotIcon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Language Assistant</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <p className="text-xs text-base-content/40">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-error"
        >
          <TrashIcon className="size-4" /> Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant" ? "bg-primary/20" : "bg-secondary/20"
              }`}
            >
              {msg.role === "assistant" ? (
                <BotIcon className="size-4 text-primary" />
              ) : (
                <UserIcon className="size-4 text-secondary" />
              )}
            </div>

            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-base-200 text-base-content rounded-tl-sm"
                  : "bg-primary text-primary-content rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <BotIcon className="size-4 text-primary" />
            </div>
            <div className="bg-base-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="loading loading-dots loading-sm text-primary" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Suggestions - WhatsApp style */}
      {showSuggestions && !isLoading && (
        <div className="px-4 sm:px-6 py-2 bg-base-100 border-t border-base-300/50">
          <div className="flex items-center gap-1.5 mb-2">
            <SparklesIcon className="size-3 text-primary" />
            <span className="text-xs text-base-content/40 font-medium">Suggestions</span>
            {isSuggestionsLoading && (
              <span className="loading loading-spinner loading-xs text-primary" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 
                           text-primary hover:bg-primary hover:text-primary-content 
                           transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 sm:px-6 py-3 bg-base-200 border-t border-base-300">
        <div className="flex items-end gap-2 bg-base-100 rounded-2xl border border-base-300 px-4 py-2">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent resize-none outline-none text-sm py-1 max-h-32 min-h-[2rem]"
            placeholder="Kuch bhi poochho... (Enter = send)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary btn-circle btn-sm shrink-0 mb-0.5"
          >
            <SendIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
