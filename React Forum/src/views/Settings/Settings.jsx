import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import ChangeEmailForm from '../../components/ChangeEmailForm/ChangeEmailForm';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import BecomeAdmin from '../../components/BecomeAdmin/BecomeAdmin';
import ChangeName from '../../components/ChangeName/ChangeName';
import ChangeProfilePicture from '../../components/ChangeProfilePicture/ChangeProfilePicture';
import AppContext from '../../context/AuthContext';

export default function Settings() {
  const { userData } = useContext(AppContext);
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [showBecomeAdmin, setShowBecomeAdmin] = useState(false);
  const [showChangeEmailForm, setShowChangeEmailFrom] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangeProfilePicture, setShowChangeProfilePicture] =
    useState(false);

  const toggleBecomeAdmin = () => {
    setShowBecomeAdmin(!showBecomeAdmin);
    setShowChangeEmailFrom(false);
    setShowChangePasswordForm(false);
    setShowChangeName(false);
    setShowChangeProfilePicture(false);
  };

  const toggleChangePasswordForm = () => {
    setShowChangePasswordForm(!showChangePasswordForm);
    setShowChangeEmailFrom(false);
    setShowBecomeAdmin(false);
    setShowChangeName(false);
    setShowChangeProfilePicture(false);
  };

  const toggleChangeEmailForm = () => {
    setShowChangeEmailFrom(!showChangeEmailForm);
    setShowChangePasswordForm(false);
    setShowBecomeAdmin(false);
    setShowChangeName(false);
    setShowChangeProfilePicture(false);
  };

  const toggleChangeName = () => {
    setShowChangeName(!showChangeName);
    setShowChangePasswordForm(false);
    setShowBecomeAdmin(false);
    setShowChangeEmailFrom(false);
    setShowChangeProfilePicture(false);
  };

  const toggleChangeProfilePicture = () => {
    setShowChangeProfilePicture(!showChangeProfilePicture);
    setShowChangeEmailFrom(false);
    setShowChangePasswordForm(false);
    setShowChangeName(false);
    setShowBecomeAdmin(false);
  };

  if (appState.user !== user) {
    setAppState({ user });
  }

  return (
    <div className="flex-col text-primary">
      <div className="flex flex-row min-h-screen">
        <div className="flex flex-col h-full mx-4 mt-16 shadow-xl bg-secondary w-108 rounded-box">
          <div className="flex flex-row items-center justify-start px-4 m-2 mx-4 space-x-4 border drop-shadow-xl w-3/3 rounded-xl">
            <button
              className="w-40 my-4 border-none btn bg-primary text-secondary hover:bg-accent hover:text-primary"
              onClick={toggleChangeName}
            >
              Change Name
            </button>
            <p className="block p-0 m-0 font-bold text-primary">
              {userData?.firstName} {userData?.lastName}
            </p>
          </div>
          <div className="flex flex-row items-center justify-start px-4 m-2 mx-4 space-x-4 border drop-shadow-xl w-3/3 rounded-xl">
            <button
              className="w-40 my-4 border-none btn bg-primary text-secondary hover:bg-accent hover:text-primary"
              onClick={toggleChangeEmailForm}
            >
              change Email
            </button>
            <p className="block p-0 m-0 font-bold text-primary">{user.email}</p>
          </div>
          {userData.role === 'admin' && (
            <div className="flex flex-row items-center justify-start px-4 m-2 mx-4 space-x-4 border drop-shadow-xl w-3/3 rounded-xl">
              <button
                className="w-40 my-4 leading-4 border-none btn bg-primary text-secondary hover:bg-accent hover:text-primary"
                onClick={toggleBecomeAdmin}
              >
                Change / Add phone number
              </button>
              <p className="mx-4 my-6 underline text-primary">
                {userData?.phoneNumber}
              </p>
            </div>
          )}
          <div className="flex flex-row items-center justify-start px-4 m-2 mx-4 space-x-4 border drop-shadow-xl w-3/3 rounded-xl">
            <button
              className="w-40 my-4 leading-4 border-none btn bg-primary text-secondary hover:bg-accent hover:text-primary"
              onClick={toggleChangePasswordForm}
            >
              change password
            </button>
          </div>
          <div className="flex flex-row items-center justify-start px-4 m-2 mx-4 space-x-4 border drop-shadow-xl w-3/3 rounded-xl">
            <button
              className="w-40 my-4 leading-4 border-none btn bg-primary text-secondary hover:bg-accent hover:text-primary"
              onClick={toggleChangeProfilePicture}
            >
              Change Profile Picture
            </button>
          </div>
        </div>
        {showBecomeAdmin && <BecomeAdmin />}
        {showChangeEmailForm && <ChangeEmailForm />}
        {showChangePasswordForm && <ChangePasswordForm />}
        {showChangeName && <ChangeName />}
        {showChangeProfilePicture && <ChangeProfilePicture />}
      </div>
    </div>
  );
}
