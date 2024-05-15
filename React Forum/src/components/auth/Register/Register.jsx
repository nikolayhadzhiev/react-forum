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
      <div className="flex flex-col min-h-screen mb-12">
        <div className="flex flex-col items-center justify-center">
          <img
            src={joinImg}
            className="mb-2 w-96 h-96"
            alt="Join the React Community"
          />
          <h1 className="mb-2 text-4xl font-bold text-primary">
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
          <div className="w-full max-w-xl signin-wrapper">
            <form
              className="px-8 pt-6 pb-8 bg-white border-2 border-solid rounded-lg shadow-xl form mb-14"
              onSubmit={onRegister}
            >
              <div className="flex mb-6">
                <div className="w-1/2 mr-2">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-bold text-gray-700"
                  >
                    First Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={updateForm('firstName')}
                    required
                  />
                </div>
                <div className="w-1/2 ml-2">
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-bold text-gray-700"
                  >
                    Last Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Email<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Username<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  type="text"
                  name="handle"
                  id="handle"
                  placeholder="Username"
                  value={form.handle}
                  onChange={updateForm('handle')}
                  required
                />
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Password<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="w-full px-3 py-2 mb-12 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                  className="absolute ml-2 right-3 top-8"
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
                  className="px-4 py-2 font-bold rounded bg-accent hover:bg-primary text-primary hover:text-white focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}{' '}
                </button>
                <button
                  className="px-4 py-2 font-bold bg-transparent text-primary hover:text-accent focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                  onClick={() => navigate('/signin')}
                >
                  Sign In
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
