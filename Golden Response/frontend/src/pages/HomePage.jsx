import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { UserPlusIcon, UsersIcon, MessageCircleIcon } from "lucide-react";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/friends");
      return res.data;
    },
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommended } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
    },
  });

  const { data: outgoingRequests = [] } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/outgoing-friend-requests");
      return res.data;
    },
  });

  const { mutate: sendRequest, isPending: sendingRequest } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.post(`/users/friend-request/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      toast.success("Friend request sent!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  const outgoingIds = new Set(outgoingRequests.map((r) => r.recipient?._id));
  const friendIds = new Set(friends.map((f) => f._id));

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Friends Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircleIcon className="size-5 text-primary" />
            <h2 className="text-xl font-bold">Your Friends</h2>
            <span className="badge badge-primary badge-sm">{friends.length}</span>
          </div>
        </div>

        {loadingFriends ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card bg-base-200 animate-pulse h-40" />
            ))}
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* Meet New People Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Meet New People</h2>
        </div>

        {loadingRecommended ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-base-200 animate-pulse h-52" />
            ))}
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center">
            <UsersIcon className="size-10 text-base-content/20 mx-auto mb-3" />
            <p className="text-base-content/50">No new users to recommend right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedUsers.map((user) => {
              const alreadyFriend = friendIds.has(user._id);
              const requestSent = outgoingIds.has(user._id);

              return (
                <div key={user._id} className="card bg-base-200 border border-base-300 hover:shadow-md transition-shadow">
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="avatar size-12 rounded-full overflow-hidden ring-2 ring-base-300">
                        <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{user.fullName}</h3>
                        {user.location && (
                          <p className="text-xs text-base-content/40 truncate">📍 {user.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(user.nativeLanguage)} Native: {user.nativeLanguage}
                      </span>
                      <span className="badge badge-outline text-xs">
                        {getLanguageFlag(user.learningLanguage)} Learning: {user.learningLanguage}
                      </span>
                    </div>

                    {user.bio && (
                      <p className="text-xs text-base-content/60 line-clamp-2 mb-3">{user.bio}</p>
                    )}

                    {alreadyFriend ? (
                      <Link to={`/chat/${user._id}`} className="btn btn-outline btn-sm w-full gap-2">
                        <MessageCircleIcon className="size-3.5" /> Message
                      </Link>
                    ) : requestSent ? (
                      <button className="btn btn-disabled btn-sm w-full">Request Sent</button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm w-full gap-2"
                        onClick={() => sendRequest(user._id)}
                        disabled={sendingRequest}
                      >
                        <UserPlusIcon className="size-3.5" /> Add Friend
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
