import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import toast from "react-hot-toast";
import {
  VideoIcon,
  ArrowLeftIcon,
  TimerIcon,
  ChevronDownIcon,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";
import ChatLoader from "../components/ChatLoader";

let clientInstance = null;

const TIMER_OPTIONS = [
  { label: "Off", value: null },
  { label: "10 sec", value: 10 },
  { label: "1 min", value: 60 },
  { label: "24 hrs", value: 86400 },
];

const LOCATION_OPTIONS = [
  { label: "15 min", value: 15 * 60 },
  { label: "1 hr", value: 60 * 60 },
  { label: "8 hrs", value: 8 * 60 * 60 },
];

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const locationIntervalRef = useRef(null);
  const locationTimeoutRef = useRef(null);
  const selectedTimerRef = useRef(null);

  useEffect(() => {
    selectedTimerRef.current = selectedTimer;
  }, [selectedTimer]);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat/token");
      return res.data;
    },
    enabled: !!authUser,
  });

  // Close all menus on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDeleteMenu(false);
      setShowTimerMenu(false);
      setShowLocationMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        if (!clientInstance) {
          clientInstance = StreamChat.getInstance(
            import.meta.env.VITE_STREAM_API_KEY
          );
        }

        if (!clientInstance.userID) {
          await clientInstance.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = clientInstance.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChatClient(clientInstance);
        setChannel(currChannel);
      } catch (err) {
        console.error("Stream chat error:", err);
        toast.error("Failed to connect to chat");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      stopSharing();
    };
  }, [tokenData, authUser, targetUserId]);

  // Self destruct handler
  const handleSendMessage = async (message) => {
    if (!channel) return;

    try {
      const sentMsg = await channel.sendMessage({
        text: message.text || "",
        attachments: message.attachments || [],
      });

      const currentTimer = selectedTimerRef.current;

      if (currentTimer) {
        const msgId = sentMsg.message.id;
        const label = TIMER_OPTIONS.find((t) => t.value === currentTimer)?.label;
        console.log(`⏱️ Message "${msgId}" deletes in ${currentTimer}s (${label})`);

        setTimeout(async () => {
          try {
            // Smoke animation pehle
            const msgEl = document.querySelector(`[data-message-id="${msgId}"]`);
            if (msgEl) {
              msgEl.style.animation = "smokeOut 0.6s ease-out forwards";
              await new Promise((r) => setTimeout(r, 600));
            }
            await clientInstance.deleteMessage(msgId, true);
            console.log(`✅ Deleted: ${msgId}`);
          } catch (e) {
            console.log("Delete error:", e.message);
          }
        }, currentTimer * 1000);
      }
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Message send nahi hua");
    }
  };

  // Delete all messages with smoke animation
  const deleteAllMessages = async (forEveryone) => {
    try {
      const result = await channel.query({ messages: { limit: 200 } });
      const msgs = result.messages;

      if (msgs.length === 0) {
        toast.error("Koi message nahi hai delete karne ke liye");
        return;
      }

      // Smoke animation — ek ek karke
      const allMsgEls = document.querySelectorAll(".str-chat__message");
      allMsgEls.forEach((el, i) => {
        setTimeout(() => {
          el.style.animation = "smokeOut 0.6s ease-out forwards";
        }, i * 60);
      });

      // 1 second baad actually delete karo
      setTimeout(async () => {
        let deleted = 0;
        for (const msg of msgs) {
          try {
            await clientInstance.deleteMessage(msg.id, forEveryone);
            deleted++;
          } catch (e) {
            console.log("Skip:", e.message);
          }
        }
        toast.success(
          forEveryone
            ? `✅ ${deleted} messages sabke liye delete ho gaye`
            : `✅ ${deleted} messages aapke liye delete ho gaye`
        );
      }, allMsgEls.length * 60 + 400);
    } catch (e) {
      toast.error("Delete failed. Try again.");
      console.error(e);
    }
  };

  // Location sharing
  const startSharing = async (duration) => {
    setShowLocationMenu(false);

    if (!navigator.geolocation) {
      toast.error("Location supported nahi hai is browser mein");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const label = LOCATION_OPTIONS.find((o) => o.value === duration)?.label;

        await channel.sendMessage({
          text: `📍 Live location share kar raha hoon (${label}):\n${mapsLink}`,
        });

        setIsSharing(true);
        toast.success(`📍 Location sharing started for ${label}`);

        locationIntervalRef.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(async (newPos) => {
            const { latitude: lat, longitude: lng } = newPos.coords;
            const newLink = `https://maps.google.com/?q=${lat},${lng}`;
            await channel.sendMessage({
              text: `📍 Updated location:\n${newLink}`,
            });
          });
        }, 30000);

        locationTimeoutRef.current = setTimeout(async () => {
          stopSharing();
          await channel.sendMessage({
            text: "📍 Live location sharing band ho gayi.",
          });
          toast.success("Location sharing ended");
        }, duration * 1000);
      },
      (err) => {
        toast.error("Location access denied. Browser settings mein allow karo.");
        console.error("Location error:", err);
      }
    );
  };

  const stopSharing = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
      locationTimeoutRef.current = null;
    }
    setIsSharing(false);
  };

  // Video call
  const handleStartCall = async () => {
    try {
      const callLink = `${window.location.origin}/call/${targetUserId}`;
      if (channel) {
        await channel.sendMessage({
          text: `📹 Video call join karo: ${callLink}`,
        });
      }
      navigate(`/call/${targetUserId}`);
    } catch (err) {
      console.error("Call start error:", err);
      toast.error("Call start nahi ho payi");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-base-200 border-b border-base-300">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Self Destruct Timer */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTimerMenu(!showTimerMenu);
                setShowLocationMenu(false);
                setShowDeleteMenu(false);
              }}
              className={`btn btn-sm gap-2 ${selectedTimer ? "btn-warning" : "btn-ghost"}`}
            >
              <TimerIcon className="size-4" />
              {selectedTimer
                ? TIMER_OPTIONS.find((t) => t.value === selectedTimer)?.label
                : "Timer"}
              <ChevronDownIcon className="size-3" />
            </button>

            {showTimerMenu && (
              <div className="absolute top-10 right-0 z-50 bg-base-200 border border-base-300 rounded-xl shadow-xl w-36 overflow-hidden">
                {TIMER_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setSelectedTimer(option.value);
                      setShowTimerMenu(false);
                      option.value
                        ? toast.success(`⏱️ Messages disappear in ${option.label}`)
                        : toast.success("Timer off");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-base-300 transition-colors
                      ${selectedTimer === option.value ? "text-warning font-semibold" : ""}`}
                  >
                    {option.value ? `⏱️ ${option.label}` : "❌ Off"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Location */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationMenu(!showLocationMenu);
                setShowTimerMenu(false);
                setShowDeleteMenu(false);
              }}
              className={`btn btn-sm gap-2 ${isSharing ? "btn-success animate-pulse" : "btn-ghost"}`}
            >
              <MapPinIcon className="size-4" />
              {isSharing ? "Sharing..." : "Location"}
              <ChevronDownIcon className="size-3" />
            </button>

            {showLocationMenu && (
              <div className="absolute top-10 right-0 z-50 bg-base-200 border border-base-300 rounded-xl shadow-xl w-40 overflow-hidden">
                {isSharing ? (
                  <button
                    onClick={() => {
                      stopSharing();
                      setShowLocationMenu(false);
                      channel.sendMessage({
                        text: "📍 Live location sharing band ho gayi.",
                      });
                      toast.success("Location sharing stopped");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-base-300 text-error"
                  >
                    🛑 Stop Sharing
                  </button>
                ) : (
                  LOCATION_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => startSharing(option.value)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-base-300"
                    >
                      📍 {option.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Delete All Chats */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDeleteMenu(!showDeleteMenu);
                setShowTimerMenu(false);
                setShowLocationMenu(false);
              }}
              className="btn btn-sm btn-ghost gap-2 text-error"
            >
              <Trash2Icon className="size-4" />
              Delete
              <ChevronDownIcon className="size-3" />
            </button>

            {showDeleteMenu && (
              <div className="absolute top-10 right-0 z-50 bg-base-200 border border-base-300 rounded-xl shadow-xl w-52 overflow-hidden">
                <button
                  onClick={() => {
                    setShowDeleteMenu(false);
                    if (!window.confirm("Sirf apne liye delete karein?")) return;
                    deleteAllMessages(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-base-300 transition-colors border-b border-base-300"
                >
                  <p className="font-medium">🙋 Delete for Me</p>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    Sirf tumhare liye hatega
                  </p>
                </button>

                <button
                  onClick={() => {
                    setShowDeleteMenu(false);
                    if (!window.confirm("Sabke liye delete karein? Wapas nahi aayega!")) return;
                    deleteAllMessages(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-base-300 transition-colors text-error"
                >
                  <p className="font-medium">👥 Delete for Everyone</p>
                  <p className="text-xs text-error/50 mt-0.5">
                    Dono ke liye permanently hatega
                  </p>
                </button>
              </div>
            )}
          </div>

          {/* Start Call */}
          <button
            onClick={handleStartCall}
            className="btn btn-sm btn-primary gap-2"
          >
            <VideoIcon className="size-4" /> Start Call
          </button>
        </div>
      </div>

      {/* Timer indicator bar */}
      {selectedTimer && (
        <div className="px-4 py-1 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
          <TimerIcon className="size-3 text-warning" />
          <span className="text-xs text-warning">
            Messages disappear in{" "}
            {TIMER_OPTIONS.find((t) => t.value === selectedTimer)?.label}
          </span>
          <button
            onClick={() => setSelectedTimer(null)}
            className="text-xs text-warning/60 hover:text-warning ml-auto"
          >
            Turn off
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList
                messageActions={[
                  "edit",
                  "delete",
                  "flag",
                  "mute",
                  "pin",
                  "quote",
                  "react",
                  "reply",
                ]}
              />
              <MessageInput
                additionalTextareaProps={{
                  placeholder: selectedTimer
                    ? `⏱️ Disappears in ${TIMER_OPTIONS.find((t) => t.value === selectedTimer)?.label}...`
                    : "Type a message or attach an image...",
                }}
                acceptedFiles={["image/*", "video/*", "audio/*", "application/*"]}
                maxNumberOfFiles={5}
                multipleUploads={true}
                overrideSubmitHandler={handleSendMessage}
              />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;