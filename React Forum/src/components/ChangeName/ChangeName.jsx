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

    if (!password || password.length < 6) {
      toast.warning('Password is required!', {
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

    if (!newFirstName) {
      toast.warning('First name is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!newLastName) {
      toast.warning('Last name is required!', {
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
                toast.error('Name not updated!', {
                  autoClose: 3000,
                  className: 'font-bold',
                });
                console.error('Error updating name:', error);
              });
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
      console.error('Change name error:', error);
    }
  };

  return (
    <div className="card w-1/2 bg-secondary shadow-2xl h-96 mx-48 my-16">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-primary">Change your Name</h2>
        <form className="flex flex-col">
          <input
            type="name"
            autoComplete="name"
            placeholder="Enter your new First Name!"
            className="input w-64 max-w-xs my-2 border-accent text-primary"
            ref={newFirstNameRef}
          />
          <input
            type="name"
            autoComplete="name"
            placeholder="Enter your new Last Name!"
            className="input w-full max-w-xs my-2 border-accent text-primary"
            ref={newLastNameRef}
          />
          <input
            type="password"
            autoComplete="password"
            placeholder="Enter your Password!"
            className="input w-full max-w-xs my-2 border-accent text-primary"
            ref={passwordRef}
          />
        </form>
        <div className="card-actions absolute bottom-0">
          <button
            className="btn btn-primary my-4 text-secondary w-48"
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
