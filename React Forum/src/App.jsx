// import './App.css'
import Home from './views/Home/Home';
import NavBar from './components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import AppContext from './context/AuthContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.service';
import AuthenticatedRoute from './hoc/AuthenticatedRoute';
import About from './views/About/About';
import Register from './components/auth/Register/Register';
import SignIn from './components/auth/SignIn/SignIn';
import Posts from './components/Posts/Posts';
import Settings from './views/Settings/Settings';
import Profile from './views/Profile/Profile';
import TenMostRecentPosts from './components/Posts/TenMostRecentPosts';
import ForgotPassword from './components/auth/SignIn/ForgotPassword';
import NotFound from './views/NotFound/NotFound';
import EditPostView from './components/Posts/EditPostView';
import PostDetails from './components/Posts/PostDetails';
import TenMostCommentedPosts from './components/Posts/TenMostCommentedPosts';

function App() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('Invalid user!');
        }

        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch((e) => console.error(e.message));
  }, [appState, user]);

  return (
    <>
      <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/10-most-recent-posts"
            element={<TenMostRecentPosts />}
          />
          <Route
            path="/10-most-commented-posts"
            element={<TenMostCommentedPosts />}
          />
          <Route
            path="/posts"
            element={
              <AuthenticatedRoute>
                <Posts />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/posts/:postId"
            element={
              <AuthenticatedRoute>
                <PostDetails />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/edit-post/:postId"
            element={
              <AuthenticatedRoute>
                <EditPostView />
              </AuthenticatedRoute>
            }
          />
          {user && (
            <Route
              path="/profile"
              element={<AuthenticatedRoute>{<Profile />}</AuthenticatedRoute>}
            />
          )}
          {user && (
            <Route
              path="/settings"
              element={<AuthenticatedRoute>{<Settings />}</AuthenticatedRoute>}
            />
          )}
          {user === null && <Route path="/register" element={<Register />} />}
          {user === null && <Route path="/signin" element={<SignIn />} />}
          {user === null && (
            <Route path="/forgot-password" element={<ForgotPassword />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer></Footer>
      </AppContext.Provider>
    </>
  );
}

export default App;
