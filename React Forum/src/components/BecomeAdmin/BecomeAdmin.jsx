import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRef } from "react";
import { logoutUser } from "../../services/auth.service";
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
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-primary">Add phone number</h2>
                    <form>
                        <input type="phone" autoComplete="phone" placeholder="Enter your Phone Number!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={passwordRef} />
                        <input type="password" autoComplete="password" placeholder="Enter your Password!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={phoneNumberRef} />
                    </form>
                    <div className="card-actions">
                        <button className="btn btn-primary my-4 text-secondary w-48" onClick={handleChangePassword}>
                            Add
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
    );
}
