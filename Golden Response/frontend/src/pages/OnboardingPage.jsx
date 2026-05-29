import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants";
import { CameraIcon, LoaderIcon, ShipWheelIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/onboarding", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile setup complete!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Onboarding failed");
    },
  });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    // setFormData({ ...formData, profilePic: `https://avatar.iran.liara.run/public/${idx}.png` });
    setFormData({ ...formData, profilePic: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${idx}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nativeLanguage || !formData.learningLanguage) {
      toast.error("Please select both languages");
      return;
    }
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <div className="flex flex-col items-center gap-2 mb-8">
              <ShipWheelIcon className="size-10 text-primary" />
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <p className="text-base-content/60 text-sm text-center">
                Tell us about yourself so we can find the perfect language partners for you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 bg-base-300">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/30">
                        <CameraIcon className="size-8" />
                      </div>
                    )}
                  </div>
                </div>
                <button type="button" onClick={handleRandomAvatar} className="btn btn-outline btn-sm gap-2">
                  <CameraIcon className="size-4" />
                  Random Avatar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Full Name</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Location</span></label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="input input-bordered"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Native Language</span></label>
                  <select
                    className="select select-bordered"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                    required
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Learning Language</span></label>
                  <select
                    className="select select-bordered"
                    value={formData.learningLanguage}
                    onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                    required
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Bio</span></label>
                <textarea
                  className="textarea textarea-bordered h-24 resize-none"
                  placeholder="Tell others about yourself and your language learning goals..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? (
                  <><LoaderIcon className="size-4 animate-spin" /> Setting up...</>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
