/* eslint-disable react/no-unescaped-entities */
import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../context/AuthContext';
import { getRegisteredUsersCount } from '../../services/users.service';
import { getAllPostsCount } from '../../services/posts.service';
import { getAllCommentsCount } from '../../services/comments.service';
import './Home.css';

export default function Home() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);

  const { userData } = useContext(AppContext);

  if (appState.user !== user) {
    setAppState({ user });
  }

  const onLogout = () => {
    logoutUser().then(() => {
      setAppState({
        user: null,
        userData: null,
      });
    });
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const usersCount = await getRegisteredUsersCount();
        setRegisteredUsersCount(usersCount);

        const postsCount = await getAllPostsCount();
        setTotalPostsCount(postsCount);

        const commentsCount = await getAllCommentsCount();
        setTotalCommentsCount(commentsCount);
      } catch (error) {
        console.error('Error fetching users/posts count:', error.message);
      }
    };

    fetchCount();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="w-full h-100% bg-primary flex items-center justify-center py-10">
          <div className="w-1/2 text-white">
            <div className="mr-20">
              <div className="pl-4 mb-2 border-l-8 border-white border-solid">
                <h1 className="mb-2 text-6xl font-bold tracking-tight">
                  {userData ? (
                    <>
                      <div>
                        Welcome, {userData.firstName} {userData.lastName}
                      </div>
                    </>
                  ) : (
                    'Welcome'
                  )}
                </h1>
                <h3 className="text-3xl tracking-tight">
                  to the "React is Not Hard" Forum!
                </h3>
              </div>
              <p className="py-3 pl-6 mb-6 text-xl font-light tracking-tight">
                Whether you're just starting your React journey or you're a
                seasoned pro, this forum is here to help you{' '}
                <span className="font-bold">
                  master React without breaking a sweat
                </span>
                . We believe that React is not as daunting as it may seem, and
                together, we'll unravel its magic.
              </p>
              {user === null ? (
                <NavLink to="/register" className="navigation-link">
                  <button className="ml-6 text-lg font-bold tracking-tight border-none rounded-full btn bg-accent hover:bg-white text-primary hover:text-primary min-w-min">
                    SIGN UP NOW
                  </button>
                </NavLink>
              ) : (
                <NavLink to="/" className="navigation-link" onClick={onLogout}>
                  <button className="ml-6 text-lg font-bold tracking-tight border-none rounded-full btn bg-accent hover:bg-white text-primary hover:text-primary min-w-min w-36">
                    Log Out
                  </button>
                </NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center p-5 my-10 ml-10 bg-white w-96 h-96 rounded-xl">
            {/*<img src={ReactLogo} />*/}
            <div className="circles">
              <div></div>
              <div></div>
              <div></div>
              <span></span>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-center w-full bg-white h-80">
          <div className="flex items-center justify-center mt-20 text-primary">
            <div className="flex flex-col items-center justify-center mr-36">
              <span className="font-bold text-8xl">{registeredUsersCount}</span>
              <p className="text-2xl tracking-wide">Registered Users</p>
            </div>
            <div className="flex flex-col items-center justify-center mr-36 text-7xl">
              |
            </div>
            <div className="flex flex-col items-center justify-center mr-36">
              <span className="font-bold text-8xl">{totalPostsCount}</span>
              <p className="text-2xl tracking-wide">Total posts</p>
            </div>
            <div className="flex flex-col items-center justify-center mr-36 text-7xl">
              |
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold text-8xl">{totalCommentsCount}</span>
              <p className="text-2xl tracking-wide">Total comments</p>
            </div>
          </div>
        </div>
        <div className="flex-grow pt-10 pb-20 bg-primary">
          <div className="flex justify-center bg-primary">
            <div className="flex flex-col items-center justify-center">
              <div className="my-10 text-6xl font-bold tracking-tight text-white">
                MAIN FORUM FEATURES
              </div>
              <div className="flex">
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      Anonymous Exploration
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38 font-thing">
                      Curious about [Your Chosen Topic]? Explore posts, ideas,
                      and discussions without the need to sign in.
                    </p>
                  </div>
                </div>
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      User Registration
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38">
                      Ready to join the conversation? Sign up with a unique
                      username and become a part of our growing community.
                    </p>
                  </div>
                </div>
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      Top 10 Posts
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38">
                      Stay informed! Check out the top 10 most commented and the
                      10 most recently created posts on our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center bg-primary">
            <div className="flex flex-col items-center justify-center">
              <div className="flex">
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      Personalized Profiles
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38">
                      Create and personalize your profile with a photo. Share
                      your thoughts, ideas, and experiences within our
                      community.
                    </p>
                  </div>
                </div>
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      Create & Comment
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38">
                      Express yourself! Create new posts or join existing
                      discussions by commenting on others' posts.
                    </p>
                  </div>
                </div>
                <div className="h-56 m-5 text-center bg-white border-b-8 card w-96 border-accent">
                  <div className="flex flex-col items-center card-body">
                    <h2 className="font-bold card-title text-primary">
                      Like & Dislike
                    </h2>
                    <hr
                      style={{
                        width: '25%',
                        borderTop: '3px solid #FFC436',
                        margin: 'auto auto 15px auto',
                      }}
                    />
                    <p className="text-primary text-m h-38">
                      Show appreciation or disagreement by liking or disliking
                      posts. Your voice matters!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
