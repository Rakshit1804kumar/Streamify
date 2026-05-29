import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { BellIcon, CheckIcon, UserCheckIcon } from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/friend-requests");
      return res.data;
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: () => toast.error("Failed to accept request"),
  });

  const incomingReqs = data?.incomingReqs || [];
  const acceptedReqs = data?.acceptedReqs || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BellIcon className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {incomingReqs.length === 0 && acceptedReqs.length === 0 ? (
        <NoNotificationsFound />
      ) : (
        <div className="space-y-6">
          {incomingReqs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/50 mb-3">
                Friend Requests ({incomingReqs.length})
              </h2>
              <div className="space-y-3">
                {incomingReqs.map((req) => (
                  <div key={req._id} className="card bg-base-200 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base-300 shrink-0">
                            <img src={req.sender.profilePic} alt={req.sender.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{req.sender.fullName}</h3>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              <span className="badge badge-secondary text-xs">
                                {getLanguageFlag(req.sender.nativeLanguage)} {req.sender.nativeLanguage}
                              </span>
                              <span className="badge badge-outline text-xs">
                                Learning {req.sender.learningLanguage}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => acceptRequest(req._id)}
                          className="btn btn-primary btn-sm gap-2 shrink-0"
                        >
                          <CheckIcon className="size-3.5" /> Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {acceptedReqs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/50 mb-3">
                Accepted ({acceptedReqs.length})
              </h2>
              <div className="space-y-3">
                {acceptedReqs.map((req) => (
                  <div key={req._id} className="card bg-base-200 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-success/30 shrink-0">
                          <img src={req.recipient.profilePic} alt={req.recipient.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{req.recipient.fullName}</h3>
                          <p className="text-xs text-success flex items-center gap-1 mt-0.5">
                            <UserCheckIcon className="size-3" /> Accepted your request
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
