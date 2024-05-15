import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import { useContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../context/AuthContext';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { imageDb } from '../../config/firebase-config';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function NavBar() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [imgUrl, setImgUrl] = useState([]);

  const { userData } = useContext(AppContext);

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    listAll(ref(imageDb, `Profile pictures`)).then((images) => {
      images.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    });
  }, []);

  const onLogout = () => {
    logoutUser().then(() => {
      setAppState({
        user: null,
        userData: null,
      });
    });
    toast.success(`See you soon, ${userData.firstName} ${userData.lastName}!`, {
      autoClose: 3000,
      className: 'font-bold',
    });
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white shadow-md navigation">
        <div className="flex items-center justify-between w-full p-4 mx-auto bg-white navbar max-w-screen-full">
          <NavLink to="/home">
            <div className="flex flex-col items-center ml-4 Logo">
              <p className="text-5xl font-extrabold tracking-tight text-primary">
                REACT
              </p>
              <p className="text-2xl font-light tracking-wide line-through text-primary">
                IS NOT HARD
              </p>
            </div>
          </NavLink>
          {/*<div className="w-4/12 form-control">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border-2 input input-bordered border-primary"
            />
          </div>*/}
          <div className="flex items-center gap-4 text-xl navigation-menu">
            <>
              <NavLink
                to="/home"
                className="p-2 font-bold tracking-wide rounded-md nav-link text-primary hover:bg-primary hover:text-white"
              >
                HOME
              </NavLink>
              |
            </>
            {user !== null ? (
              <NavLink
                to="/posts"
                className="p-2 font-bold tracking-wide rounded-md nav-link text-primary hover:bg-primary hover:text-white"
              >
                POSTS
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/10-most-commented-posts"
                  className="p-2 font-bold tracking-wide rounded-md nav-link text-primary hover:bg-primary hover:text-white"
                >
                  10 MOST COMMENTED POSTS
                </NavLink>
                |
                <NavLink
                  to="/10-most-recent-posts"
                  className="p-2 font-bold tracking-wide rounded-md nav-link text-primary hover:bg-primary hover:text-white"
                >
                  10 MOST RECENT POSTS
                </NavLink>
              </>
            )}
            <>
              |
              <NavLink
                to="/about"
                className="p-2 font-bold tracking-wide rounded-md nav-link text-primary hover:bg-primary hover:text-white"
              >
                ABOUT
              </NavLink>
            </>
          </div>
          <div className="flex items-center gap-2 navigation-menu">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer btn-circle">
                <div className="flex items-center justify-center rounded-full text-secondary">
                  {user === null ? (
                    <GiHamburgerMenu className="mr-4 scale-150 text-primary" />
                  ) : imgUrl.length > 0 ? (
                    <img
                      src={imgUrl[0]}
                      alt="Profile Avatar"
                      className="object-cover mr-2 bg-white rounded-full w-14 h-14"
                    />
                  ) : (
                    <span className="text-2xl font-bold pt-2.5 bg-primary text-white rounded-full w-14 h-14 text-center mr-4">
                      {userData?.firstName[0]}
                      {userData?.lastName[0]}
                    </span>
                  )}
                </div>
              </label>
              <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-60 flex flex-col items-center">
                <li className="mb-2">
                  {user !== null && (
                    <p className="font-bold tracking-wide text-primary hover:bg-white hover:text-primary">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                  )}
                </li>
                {user !== null && (
                  <NavLink to="/profile">
                    <li className="mb-2">
                      <p className="justify-between tracking-wide text-primary hover:bg-white hover:text-primary hover:underline">
                        Profile
                      </p>
                    </li>
                  </NavLink>
                )}
                {user !== null && (
                  <NavLink to="/settings">
                    <li className="mb-2">
                      <p className="justify-between text-primary hover:bg-white hover:text-primary hover:underline">
                        Settings
                      </p>
                    </li>
                  </NavLink>
                )}
                <li className="mb-2">
                  <div className="justify-between">
                    {user === null && (
                      <NavLink to="/register" className="navigation-link">
                        <button className="w-24 h-10 text-sm font-bold text-white border-none btn hover:bg-accent hover:text-primary min-w-min">
                          Sign Up
                        </button>
                      </NavLink>
                    )}
                    {user === null && (
                      <NavLink to="/signin" className="navigation-link">
                        <button className="w-24 h-10 text-sm font-bold text-white border-none btn hover:bg-accent hover:text-primary min-w-min">
                          Log In
                        </button>
                      </NavLink>
                    )}
                  </div>
                  {user !== null && (
                    <NavLink
                      to="/"
                      className="navigation-link"
                      onClick={onLogout}
                    >
                      <button className="w-24 h-10 text-sm font-bold text-white border-none btn hover:bg-accent hover:text-primary min-w-min bg-primary">
                        Log Out
                      </button>
                    </NavLink>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ToastContainer />
      </nav>
    </>
  );
}
