import { useContext, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import { loginUser } from '../../../services/auth.service';
import { useNavigate, NavLink } from 'react-router-dom';
import joinImg from '../../../assets/images/undraw_join_re_w1lh.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase-config';
import { MIN_PASSWORD_LENGTH } from '../../../common/constants';
import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';

const SignIn = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onLogin = (e) => {
    e.preventDefault();

    if (!form.email) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }
    if (!form.password) {
      toast.warning('Password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      toast.warning('Password must be at least 6 characters long!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      loginUser(form.email, form.password)
        .then((credential) => {
          setContext({
            user: credential.user,
          });
        })
        .then(() => {
          navigate('/');
          toast.success(`Welcome to the forum!`, {
            autoClose: 3000,
            className: 'font-bold',
          });
        })
        .catch(() => {
          toast.error('Invalid email or password. Please try again.', {
            autoClose: 3000,
            className: 'font-bold',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col mt-12 mb-12">
        <div className="flex flex-col items-center justify-center">
          <img
            src={joinImg}
            className="w-80 h-80 mb-8"
            alt="Sign in the React Community"
          />
          <h1 className="text-4xl font-bold text-primary mb-2">
            Log In & Master React Development Effortlessly
          </h1>
          <p className=" mb-6 text-primary">
            Access the forum to unlock React expertise with ease!
          </p>
          <hr
            style={{
              width: '10%',
              borderTop: '3px solid #FFC436',
              marginBottom: '50px',
            }}
          />
          <div className="signin-wrapper w-full max-w-xl">
            <form
              className="form bg-white shadow-xl border-solid border-2 rounded-lg px-8 pt-6 pb-8 mb-4"
              onSubmit={onLogin}
            >
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={updateForm('email')}
                  required
                />
              </div>
              <div className="mb-16 relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password<span className="text-red-500"> ✱</span>
                </label>
                <div className="flex items-center">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="******************"
                    value={form.password}
                    onChange={updateForm('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleClickShowPassword}
                    className="ml-2 absolute right-3 top-8"
                  >
                    {showPassword ? (
                      <img
                        src={hidden}
                        className="w-7 h-7"
                        alt="Hide Password"
                      />
                    ) : (
                      <img
                        src={visible}
                        className="w-7 h-7"
                        alt="Show Password"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Sign In'}{' '}
                </button>
                <NavLink to="/forgot-password">
                  <span className="inline-block align-baseline font-bold text-sm text-primary hover:text-accent cursor-pointer">
                    Forgot Password?
                  </span>
                </NavLink>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SignIn;
