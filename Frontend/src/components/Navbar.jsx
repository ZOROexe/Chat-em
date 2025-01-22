import React, { useEffect, useState } from "react";
import { MessageSquare, MoonIcon, SunIcon, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { logout, authUser } = useAuth();
  const [currTheme, setCurrTheme] = useState(theme);

  function handleClick() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setCurrTheme(newTheme);
  }

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1>Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-small transition-colors gap-2"
              onClick={handleClick}
            >
              {currTheme === "dark" ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </button>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-small gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
