import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useRef } from 'react';
import { logoutUser } from '../../services/auth.service';
import { ToastContainer, toast } from 'react-toastify';

export default function BecomeAdmin() {
  const passwordRef = useRef();
  const phoneNumberRef = useRef();

  const auth = getAuth();

  const handleChangePassword = () => {
    const user = auth.currentUser;
    const phoneNumber = phoneNumberRef.current.value;
    const password = passwordRef.current.value;
    const credentials = EmailAuthProvider.credential(user.email, password);

    if (!password || password.length < 6) {
      toast.warning('Phone number is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    const isPasswordCorrect = user.providerData[0].providerId === 'password';

    if (!isPasswordCorrect) {
      toast.warning('Wrong old password!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 6) {
      toast.warning('Password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    reauthenticateWithCredential(user, credentials)
      .then(() => {
        updatePassword(user, phoneNumber)
          .then(() => {
            toast.success(`Your password has been changed!`, {
              autoClose: 3000,
              className: 'font-bold',
            });
          })
          .then(() => {
            toast.success(`Goodbye, ${user.email}`, {
              autoClose: 3000,
              className: 'font-bold',
            });
          })
          .then(() => {
            logoutUser();
          })
          .catch((error) => {
            toast.error(
              'Something went wrong with updating your password! Try again!',
              {
                autoClose: 3000,
                className: 'font-bold',
              }
            );
            console.error(error);
          });
      })
      .catch((error) => {
        toast.error(
          'Something went wrong with updating your password! Try again!',
          {
            autoClose: 3000,
            className: 'font-bold',
          }
        );
        console.error('Reauthentication error:', error);
      });
  };

  return (
    <div className="w-1/2 mx-24 my-16 border shadow-xl card bg-secondary h-96 text-primary">
      <div className="items-center w-full text-center card-body">
        <h2 className="font-bold uppercase card-title text-primary">
          Add phone number
        </h2>
        <form className="flex flex-col items-center w-full">
          <input
            type="phone"
            autoComplete="phone"
            placeholder="Enter your phone number..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={passwordRef}
          />
          <input
            type="password"
            autoComplete="password"
            placeholder="Enter your password..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={phoneNumberRef}
          />
        </form>
        <div className="absolute bottom-5 card-actions">
          <button
            className="w-48 btn btn-primary text-secondary hover:bg-accent hover:text-primary hover:border-none"
            onClick={handleChangePassword}
          >
            Add
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
