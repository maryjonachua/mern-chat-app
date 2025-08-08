import { Link, useNavigate } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const NavBar = () => {
  const { logout, authUser } = useAuthStore();
  const { unreadCounter } = useChatStore();

  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <MessageSquare className="w-5 h-5 text-primary" />
          Chat Room
        </Link>
      </div>
      <div className="flex-none mx-5">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle mr-2">
            {" "}
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* bell notification */}
              {unreadCounter > 0 ? (
                <span className="badge badge-xs badge-primary indicator-item bg-red-700 text-white border-0">
                  {unreadCounter}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-1 mt-2 w-44 shadow">
            <div className="card-body">
              {/* dropdown */}
              {unreadCounter > 0 ? (
                <span className="text-xs">You have {unreadCounter} unread messages.</span>
              ) : (
                <span className="text-xs">You have no unread messages.</span>
              )}
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={authUser.profilePic || "/avatar.png"} />
            </div>
          </div>

          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1  w-52 p-2 shadow">
            <div className="flex items-center px-2 my-2 -mb-2 font-bold">{authUser.fullName}</div>
            <div className="divider -mb-1"></div>
            <li onClick={() => navigate("/profile")}>
              <div className="flex flex-row">
                <User className="size-4" />
                <Link to="/profile">Profile</Link>
              </div>
            </li>
            <li onClick={() => navigate("/settings")}>
              <div className="flex flex-row">
                <Settings className="size-4" />
                <Link to="/settings">Settings</Link>
              </div>
            </li>
            <li onClick={logout}>
              <div className="flex flex-row" onClick={logout}>
                <LogOut className="size-4" />
                <button>Logout</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
