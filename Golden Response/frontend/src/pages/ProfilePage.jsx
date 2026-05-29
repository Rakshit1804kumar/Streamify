import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { CameraIcon, CheckIcon, EditIcon, LoaderIcon, MapPinIcon, XIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { getLanguageFlag } from "../components/FriendCard";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put("/users/profile", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile updated!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    // const newPic = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newPic = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${idx}`;
    setFormData({ ...formData, profilePic: newPic });
  };

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    updateProfile(formData);
  };

  const handleCancel = () => {
    setFormData({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      location: authUser?.location || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      profilePic: authUser?.profilePic || "",
    });
    setIsEditing(false);
  };

  if (!authUser) return null;
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline btn-sm gap-2"
              >
                <EditIcon className="size-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="btn btn-ghost btn-sm gap-2">
                  <XIcon className="size-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm gap-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <LoaderIcon className="size-4 animate-spin" />
                  ) : (
                    <CheckIcon className="size-4" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 bg-base-300">
                <img
                  src={isEditing ? formData.profilePic : authUser.profilePic}
                  alt={authUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  onClick={handleRandomAvatar}
                  className="absolute -bottom-1 -right-1 btn btn-circle btn-sm btn-primary"
                  title="Change avatar"
                >
                  <CameraIcon className="size-4" />
                </button>
              )}
            </div>
            {isEditing && (
              <p className="text-xs text-base-content/50">Click camera to randomize avatar</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                  Full Name
                </span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              ) : (
                <p className="px-1 py-2 font-semibold text-lg">{authUser.fullName}</p>
              )}
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                  Bio
                </span>
              </label>
              {isEditing ? (
                <textarea
                  className="textarea textarea-bordered h-24 resize-none"
                  placeholder="Tell others about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              ) : (
                <p className="px-1 py-2 text-base-content/70 text-sm">
                  {authUser.bio || <span className="italic text-base-content/40">No bio yet</span>}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                  Location
                </span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="City, Country"
                  className="input input-bordered"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              ) : (
                <p className="px-1 py-2 text-sm flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-primary" />
                  {authUser.location || <span className="italic text-base-content/40">Not set</span>}
                </p>
              )}
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                    Native Language
                  </span>
                </label>
                {isEditing ? (
                  <select
                    className="select select-bordered"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-1 py-2">
                    <span className="badge badge-secondary gap-1">
                      {getLanguageFlag(authUser.nativeLanguage)} {authUser.nativeLanguage || "Not set"}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                    Learning Language
                  </span>
                </label>
                {isEditing ? (
                  <select
                    className="select select-bordered"
                    value={formData.learningLanguage}
                    onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-1 py-2">
                    <span className="badge badge-outline gap-1">
                      {getLanguageFlag(authUser.learningLanguage)} {authUser.learningLanguage || "Not set"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email (readonly) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70 text-xs uppercase tracking-wider">
                  Email
                </span>
              </label>
              <p className="px-1 py-2 text-sm text-base-content/50">{authUser.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
