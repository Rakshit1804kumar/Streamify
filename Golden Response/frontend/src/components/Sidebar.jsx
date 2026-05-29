import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import { axiosInstance } from "../lib/axios";
import { BotMessageSquareIcon, HomeIcon, MessageCircleIcon, ShipWheelIcon, UserIcon, UsersIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { getLanguageFlag } from "./FriendCard";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/friends");
      return res.data;
    },
  });

  const navLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/notifications", icon: UsersIcon, label: "Friend Requests" },
    { to: "/profile", icon: UserIcon, label: "Profile" },
    { to: "/ai-chat", icon: BotMessageSquareIcon, label: "AI Assistant" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-base-200 border-r border-base-300 flex flex-col sticky top-0 z-20">
      {/* Logo */}
      <div className="p-4 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-8 text-primary" />
          <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
              ${location.pathname === to
                ? "bg-primary text-primary-content shadow-sm"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
              }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Friends Section */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="flex items-center gap-2 mb-3 px-1">
          <MessageCircleIcon className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
            Friends ({friends.length})
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-base-300 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-base-300 rounded w-3/4" />
                    <div className="h-2 bg-base-300 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-6 px-2">
              <UsersIcon className="size-8 text-base-content/20 mx-auto mb-2" />
              <p className="text-xs text-base-content/40">No friends yet</p>
              <p className="text-xs text-base-content/30 mt-0.5">Add friends from Home</p>
            </div>
          ) : (
            friends.map((friend) => (
              <Link
                key={friend._id}
                to={`/chat/${friend._id}`}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-base-300 group
                  ${location.pathname === `/chat/${friend._id}` ? "bg-base-300" : ""}`}
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-base-300 group-hover:ring-primary/30 transition-all">
                    <img
                      src={friend.profilePic || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=default'}
                      
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.fullName}</p>
                  <p className="text-xs text-base-content/40 truncate">
                    {friend.nativeLanguage}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User Profile at bottom */}
      {authUser && (
        <div className="p-3 border-t border-base-300">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-300 transition-all">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
              <img
                src={authUser.profilePic || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=default'}
                alt={authUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{authUser.fullName}</p>
              <p className="text-xs text-base-content/40 truncate">{authUser.email}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
