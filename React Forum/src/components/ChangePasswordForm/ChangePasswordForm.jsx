import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRef } from "react";
import { logoutUser } from "../../services/auth.service";
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
                        toast.error('Something went wrong with updating your password! Try again!', {
                            autoClose: 3000,
                            className: 'font-bold',
                          });
                        console.error(error);
                    });
            })
            .catch((error) => {
                toast.error('Something went wrong with updating your password! Try again!', {
                    autoClose: 3000,
                    className: 'font-bold',
                  });
                console.error('Reauthentication error:', error);
            });
    };

    return (
            <div className="card w-1/2 bg-secondary shadow-2xl h-96 mx-48 my-16">
                <div className="card-body items-center text-center align-center">
                    <h2 className="card-title text-primary">Change your Password</h2>
                    <form>
                        <input type="password" autoComplete="password" placeholder="Enter your old Password!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={oldPasswordRef} />
                        <input type="password" autoComplete="password" placeholder="Enter your new Password!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={newPasswordRef} />
                    </form>
                    <div className="card-actions absolute bottom-0">
                        <button className="btn btn-primary my-4 text-secondary w-48" onClick={handleChangePassword}>
                            Change Password
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
    );
}
