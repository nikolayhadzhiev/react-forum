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
      <nav className="navigation bg-white flex justify-between items-center shadow-md">
        <div
          className="navbar bg-white
       flex items-center justify-between w-full max-w-screen-full mx-auto p-4"
        >
          <NavLink to="/home">
            <div className="Logo flex flex-col items-center ml-4">
              <p className="text-primary text-5xl tracking-tight font-extrabold">
                REACT
              </p>
              <p className="line-through text-primary text-2xl tracking-wide font-light">
                IS NOT HARD
              </p>
            </div>
          </NavLink>
          {/*<div className="form-control w-4/12">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered border-primary border-2 w-full bg-white"
            />
          </div>*/}
          <div className="text-xl navigation-menu flex gap-4 items-center">
            <>
              <NavLink
                to="/home"
                className="nav-link font-bold text-primary hover:bg-primary hover:text-white p-2 rounded-md tracking-wide"
              >
                HOME
              </NavLink>
              |
            </>
            {user !== null ? (
              <NavLink
                to="/posts"
                className="nav-link font-bold text-primary hover:bg-primary hover:text-white p-2 rounded-md tracking-wide"
              >
                POSTS
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/10-most-commented-posts"
                  className="nav-link font-bold text-primary hover:bg-primary hover:text-white p-2 rounded-md tracking-wide"
                >
                  10 MOST COMMENTED POSTS
                </NavLink>
                |
                <NavLink
                  to="/10-most-recent-posts"
                  className="nav-link font-bold text-primary hover:bg-primary hover:text-white p-2 rounded-md tracking-wide"
                >
                  10 MOST RECENT POSTS
                </NavLink>
              </>
            )}
            <>
              |
              <NavLink
                to="/about"
                className="nav-link font-bold text-primary hover:bg-primary hover:text-white p-2 rounded-md tracking-wide"
              >
                ABOUT
              </NavLink>
            </>
          </div>
          <div className="navigation-menu flex gap-2 items-center">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn-circle cursor-pointer">
                <div className="text-secondary flex items-center justify-center rounded-full">
                  {user === null ? (
                    <GiHamburgerMenu className="text-primary scale-150 mr-4" />
                  ) : imgUrl.length > 0 ? (
                    <img
                      src={imgUrl[0]}
                      alt="Profile Avatar"
                      className="bg-white w-14 h-14 rounded-full mr-2"
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
                    <p className="font-bold mb-5 text-primary hover:bg-white hover:text-primary tracking-wide">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                  )}
                </li>
                {user !== null && (
                  <NavLink to="/profile">
                    <li className="mb-2">
                      <p className="text-primary justify-between hover:bg-white hover:text-primary hover:underline tracking-wide">
                        Profile
                      </p>
                    </li>
                  </NavLink>
                )}
                {user !== null && (
                  <NavLink to="/settings">
                    <li className="mb-2">
                      <p className="text-primary justify-between hover:bg-white hover:text-primary hover:underline">
                        Settings
                      </p>
                    </li>
                  </NavLink>
                )}
                <li className="mb-2">
                  <div className="justify-between">
                    {user === null && (
                      <NavLink to="/register" className="navigation-link">
                        <button className="btn hover:bg-accent border-none hover:text-primary font-bold min-w-min text-white text-sm w-24 h-10">
                          Sign Up
                        </button>
                      </NavLink>
                    )}
                    {user === null && (
                      <NavLink to="/signin" className="navigation-link">
                        <button className="btn hover:bg-accent border-none hover:text-primary font-bold min-w-min text-white text-sm w-24 h-10">
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
                      <button className="btn hover:bg-accent border-none hover:text-primary font-bold min-w-min text-white text-sm w-24 h-10">
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
