import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, UserIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-2">
          {isChatPage && (
            <div className="mr-auto pl-2">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-8 text-primary" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-5 w-5 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <Link to="/profile" className="btn btn-ghost btn-circle">
            <div className="avatar">
              <div className="w-8 rounded-full ring-2 ring-primary/20">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </div>
          </Link>

          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
