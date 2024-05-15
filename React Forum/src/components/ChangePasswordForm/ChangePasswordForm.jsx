import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useRef } from 'react';
import { logoutUser } from '../../services/auth.service';
import { ToastContainer, toast } from 'react-toastify';

export default function ChangePasswordForm() {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const auth = getAuth();

  const handleChangePassword = () => {
    const user = auth.currentUser;
    const newPassword = newPasswordRef.current.value;
    const oldPassword = oldPasswordRef.current.value;
    const credentials = EmailAuthProvider.credential(user.email, oldPassword);

    if (!oldPassword || oldPassword.length < 6) {
      toast.warning('Old password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    const isOldPasswordCorrect = user.providerData[0].providerId === 'password';

    if (!isOldPasswordCorrect) {
      toast.warning('Wrong old password!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.warning('New password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (newPassword === oldPassword) {
      toast.warning('Cannot change to your old password!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    reauthenticateWithCredential(user, credentials)
      .then(() => {
        updatePassword(user, newPassword)
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
      <div className="items-center text-center card-body align-center">
        <h2 className="font-bold uppercase card-title text-primary">
          Change your Password
        </h2>
        <form>
          <input
            type="password"
            autoComplete="password"
            placeholder="Enter your old password..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={oldPasswordRef}
          />
          <input
            type="password"
            autoComplete="password"
            placeholder="Enter your new password..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={newPasswordRef}
          />
        </form>
        <div className="absolute card-actions bottom-5">
          <button
            className="w-48 btn btn-primary text-secondary hover:bg-accent hover:text-primary hover:border-none"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
