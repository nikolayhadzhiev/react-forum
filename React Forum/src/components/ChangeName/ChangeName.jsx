import { auth, db } from '../../config/firebase-config';
import { useRef } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { logoutUser } from '../../services/auth.service';
import { get, ref, set } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';

export default function ChangeName() {
  const newFirstNameRef = useRef();
  const newLastNameRef = useRef();
  const passwordRef = useRef();

  const handleChangeName = async () => {
    const user = auth.currentUser;
    const newFirstName = newFirstNameRef.current.value;
    const newLastName = newLastNameRef.current.value;
    const password = passwordRef.current.value;
    const credentials = EmailAuthProvider.credential(user.email, password);

    if (password || password.length < 6) {
      toast.warning('Password is required', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    const isOldPasswordCorrect = user.providerData[0].providerId === 'password';

    if (isOldPasswordCorrect) {
      toast.warning('Wrong password', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (newFirstName) {
      toast.warning('First name is required', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (newLastName) {
      toast.warning('Last name is required', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    try {
      await reauthenticateWithCredential(user, credentials);

      const userHandle = user.handle; // Assuming the handle is available on the user object
      const dbRef = ref(db, 'users');

      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const users = snapshot.val();
            const userDataRef = ref(db, `users/${userHandle}`);
            set(userDataRef, {
              ...users[userHandle],
              firstName: newFirstName,
              lastName: newLastName,
            })
              .then(() => {
                toast.success(
                  `Your name has been changed to ${newFirstName} ${newLastName}`,
                  {
                    autoClose: 3000,
                    className: 'font-bold',
                  }
                );
              })
              .then(() => {
                logoutUser();
              })
              .catch((error) => {
                toast.error('Name not updated', {
                  autoClose: 3000,
                  className: 'font-bold',
                });
                console.error('Error updating name:', error);
              });
          }
        })
        .catch((error) => {
          toast.error("Couldn't retrieve user information", {
            autoClose: 3000,
            className: 'font-bold',
          });
          console.error('Error retrieving user handle:', error);
        });
    } catch (error) {
      toast.error('Something went wrong', {
        autoClose: 3000,
        className: 'font-bold',
      });
      console.error('Change name error:', error);
    }
  };

  return (
    <div className="w-1/2 mx-24 my-16 border shadow-xl card bg-secondary h-96 text-primary">
      <div className="items-center text-center card-body">
        <h2 className="font-bold uppercase card-title text-primary">
          Change your Name
        </h2>
        <form className="flex flex-col items-center w-full">
          <input
            type="name"
            autoComplete="name"
            placeholder="Enter your new first name..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={newFirstNameRef}
          />
          <input
            type="name"
            autoComplete="name"
            placeholder="Enter your new last name..."
            className="w-full max-w-xs my-2 input border-primary bg-secondary text-primary"
            ref={newLastNameRef}
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
            onClick={handleChangeName}
          >
            Change Name
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
