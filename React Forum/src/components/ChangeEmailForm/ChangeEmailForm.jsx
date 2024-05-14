import { auth, db } from "../../config/firebase-config";
import { useRef } from "react";
import { verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { logoutUser } from "../../services/auth.service";
import { get, ref, set } from "firebase/database";
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
            toast.warning('Cannot use your old Email!', {
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
                                        toast.success(`Your email has been changed to ${newEmail}`, {
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
    }

    return (
        <div className="card w-1/2 bg-secondary shadow-2xl h-96 mx-48 my-16">
            <div className="card-body items-center text-center">
                <h2 className="card-title text-primary">Change your Email</h2>
                <form>
                    <input type="email" autoComplete="email" placeholder="Enter your new Email!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={newEmailRef} />
                    <input type="password" autoComplete="password" placeholder="Enter your Password!" className="input w-full max-w-xs my-2 border-accent text-primary" ref={passwordRef} />
                </form>
                <div className="card-actions absolute bottom-0">
                    <button className="btn btn-primary my-4 text-secondary w-48" onClick={handleChangeEmail}>
                        Change Email
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
