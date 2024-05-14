import { useContext, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import {
  getUserByHandle,
  createUserHandle,
} from '../../../services/users.service';
import { registerUser } from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import joinImg from '../../../assets/images/undraw_world_re_768g.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  USER_MIN_NAME_LENGTH,
  USER_MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALID_EMAIL,
  VALID_PHONE_NUMBER,
} from '../../../common/constants';
import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    handle: '',
    phoneNumber: '',
    password: '',
    role: 'user',
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

  const onRegister = (event) => {
    event.preventDefault();

    if (!form.firstName) {
      toast.warning('First Name is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.lastName) {
      toast.warning('Last Name is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (
      form.firstName.length < USER_MIN_NAME_LENGTH ||
      form.firstName.length > USER_MAX_NAME_LENGTH
    ) {
      toast.warning(
        `First Name must contain between ${USER_MIN_NAME_LENGTH} and ${USER_MAX_NAME_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    if (
      form.lastName.length < USER_MIN_NAME_LENGTH ||
      form.lastName.length > USER_MAX_NAME_LENGTH
    ) {
      toast.warning(
        `Last Name must contain between ${USER_MIN_NAME_LENGTH} and ${USER_MAX_NAME_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    if (form.phoneNumber && !VALID_PHONE_NUMBER.test(form.phoneNumber)) {
      toast.warning(`Please enter a valid phone number (digits only)!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.email) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.email.match(VALID_EMAIL)) {
      toast.warning('Invalid email format!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.handle) {
      toast.warning('Username is required!', {
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
      getUserByHandle(form.handle)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();

            if (userData.email === form.email) {
              throw new Error(`Email ${form.email} has already been taken!`);
            } else if (userData.handle === form.handle) {
              throw new Error(
                `Username ${form.handle} has already been taken!`
              );
            }
          }

          return registerUser(form.email, form.password);
        })
        .then((credential) => {
          navigate('/');
          toast.success(`Welcome to the forum!`, {
            autoClose: 3000,
            className: 'font-bold',
          });
          return createUserHandle(
            form.handle,
            form.firstName,
            form.lastName,
            form.phoneNumber,
            credential.user.uid,
            credential.user.email,
            form.role
          ).then(() => {
            setContext({
              user: credential.user,
              userData: {
                firstName: form.firstName,
                lastName: form.lastName,
                handle: form.handle,
                email: form.email,
                phoneNumber: form.phoneNumber,
                role: form.role,
              },
            });
          });
        })
        .catch((e) => {
          if (e.message === 'Firebase: Error (auth/email-already-in-use).') {
            toast.error(`Email ${form.email} has already been taken!`, {
              autoClose: 3000,
              className: 'font-bold',
            });
          } else {
            toast.error(e.message, {
              autoClose: 3000,
              className: 'font-bold',
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col mb-12">
        <div className="flex flex-col items-center justify-center">
          <img
            src={joinImg}
            className="w-96 h-96 mb-2"
            alt="Join the React Community"
          />
          <h1 className="text-4xl font-bold text-primary mb-2">
            Connect, Share & Learn
          </h1>
          <p className="mb-6 text-primary">
            Access the forum and master React development without breaking a
            sweat!
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
              className="form bg-white shadow-xl border-solid border-2 rounded-lg px-8 pt-6 pb-8 mb-14"
              onSubmit={onRegister}
            >
              <div className="mb-6 flex">
                <div className="mr-2 w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    First Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={updateForm('firstName')}
                    required
                  />
                </div>
                <div className="ml-2 w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Last Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={updateForm('lastName')}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Phone Number (optional)"
                  value={form.phoneNumber}
                  onChange={updateForm('phoneNumber')}
                />
              </div>
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
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={updateForm('email')}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="handle"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Username<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="handle"
                  id="handle"
                  placeholder="Username"
                  value={form.handle}
                  onChange={updateForm('handle')}
                  required
                />
              </div>
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-12"
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
                    <img src={hidden} className="w-7 h-7" alt="Hide Password" />
                  ) : (
                    <img
                      src={visible}
                      className="w-7 h-7"
                      alt="Show Password"
                    />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}{' '}
                </button>
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                  onClick={() => navigate('/signin')}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Register;
