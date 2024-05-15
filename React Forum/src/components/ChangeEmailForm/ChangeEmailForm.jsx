import { auth, db } from '../../config/firebase-config';
import { useRef } from 'react';
import {
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { logoutUser } from '../../services/auth.service';
import { get, ref, set } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';

export default function ChangeEmailForm() {
  const newEmailRef = useRef();
  const passwordRef = useRef();

  const handleChangeEmail = async () => {
    const user = auth.currentUser;
    const newEmail = newEmailRef.current.value;
    const password = passwordRef.current.value;
    const credentials = EmailAuthProvider.credential(user.email, password);

    if (newEmail === user.email) {
      toast.warning('Cannot use your old email!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    const isOldPasswordCorrect = user.providerData[0].providerId === 'password';

    if (!isOldPasswordCorrect) {
      toast.warning('Wrong password!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!password || password.length < 6) {
      toast.warning('Password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!newEmail) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    try {
      await reauthenticateWithCredential(user, credentials);
      await verifyBeforeUpdateEmail(user, newEmail);

      const userEmail = user.email;
      const dbRef = ref(db, 'users');

      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const users = snapshot.val();
            for (const handle in users) {
              if (users[handle].email === userEmail) {
                // Now you have the user's handle
                const userHandle = handle;
                const emailRef = ref(db, `users/${userHandle}/email`);

                set(emailRef, newEmail)
                  .then(() => {
                    toast.success(
                      `Your email has been changed to ${newEmail}`,
                      {
                        autoClose: 3000,
                        className: 'font-bold',
                      }
                    );
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
                    toast.error('Email not updated!', {
                      autoClose: 3000,
                      className: 'font-bold',
                    });
                    console.error('Error updating email:', error);
                  });
                break;
              }
            }
          }
        })
        .catch((error) => {
          toast.error("Couldn't retrieve user information!", {
            autoClose: 3000,
            className: 'font-bold',
          });
          console.error('Error retrieving user handle:', error);
        });
    } catch (error) {
      toast.error('Something went wrong!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      console.error('Change email error:', error);
    }
  };

  return (
    <div className="w-1/2 mx-24 my-16 border shadow-xl card bg-secondary h-96 text-primary">
      <div className="items-center w-full text-center card-body">
        <h2 className="font-bold uppercase card-title text-primary">
          Change your Email
        </h2>
        <form>
          <input
            type="email"
            autoComplete="email"
            placeholder="Enter your new email..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={newEmailRef}
          />
          <input
            type="password"
            autoComplete="password"
            placeholder="Enter your password..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={passwordRef}
          />
        </form>
        <div className="absolute bottom-5 card-actions">
          <button
            className="w-48 btn btn-primary text-secondary hover:bg-accent hover:text-primary hover:border-none"
            onClick={handleChangeEmail}
          >
            Change Email
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
