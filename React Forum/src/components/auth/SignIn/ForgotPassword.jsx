import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebase-config';
import forgotPasswordImg from '../../../assets/images/undraw_forgot_password_re_hxwm.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success(
            'Reset password link sent to your email. Check your inbox!',
            {
              autoClose: 3000,
              className: 'font-bold',
            }
          );
          navigate('/signin');
        })
        .catch((error) => {
          toast.error(
            'Password reset email could not be sent. Please try again!',
            {
              autoClose: 3000,
              className: 'font-bold',
            }
          );
          console.error('Password reset email error:', error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
    setEmail('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col mt-14 mb-14">
      <div className="flex flex-col items-center justify-center">
        <img
          src={forgotPasswordImg}
          className="w-1/4 h-1/4 mb-10"
          alt="Forgot Password"
        />
        <h1 className="text-4xl font-bold text-primary mb-2">
          Forgot Your Password?
        </h1>
        <p className="mb-6 text-primary">
          Enter your email address to reset your password
        </p>
        <hr
          style={{
            width: '10%',
            borderTop: '3px solid #FFC436',
            marginBottom: '50px',
          }}
        />
        <div className="forgot-password-wrapper w-full lg:w-2/3 max-w-xl">
          <form
            className="form bg-white shadow-xl border-solid border-2 rounded-lg px-8 pt-6 pb-8 mb-4"
            onSubmit={handleResetPassword}
          >
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-12"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex items-center justify-center lg:justify-between">
              <button
                className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? 'Sending email...' : 'Reset Password'}
              </button>
              <button
                className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
                onClick={() => navigate('/signin')}
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
