import AppContext from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import ProfilePosts from '../../components/ProfilePosts/ProfilePosts';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { imageDb } from '../../config/firebase-config';
import { getPostsByAuthor } from '../../services/posts.service';
import ProfileUsers from '../../components/ProfileUsers/ProfileUsers';

const Profile = () => {
  const { userData } = useContext(AppContext);
  const [imgUrl, setImgUrl] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    listAll(ref(imageDb, `Profile pictures`)).then((images) => {
      images.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    });

    if (userData?.handle && showMyPosts) {
      // Fetch posts only if userData.handle is defined
      if (userData?.handle) {
        getPostsByAuthor(userData.handle)
          .then((posts) => {
            setUserPosts(posts);
          })
          .catch((error) => {
            console.error('Error getting posts', error.message);
          });
      }
    }
  }, [userData?.handle, showMyPosts]);

  const handleMyPostsClick = () => {
    setShowMyPosts((prev) => !prev);
    setShowUsers(false);
  };

  const handleUsersClick = () => {
    setShowUsers((prev) => !prev);
    setShowMyPosts(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex flex-col justify-center h-48 px-2 mt-4 space-y-2 border divide-y rounded-md drop-shadow divide-primary/25 min-w-max bg-secondary align-center w-96 basis 1/2">
        <div className="rounded-full w-14">
          <div className="items-center p-2 avatar placeholder">
            <div
              className={`rounded-full shadow-2xl text-secondary w-14 ${
                imgUrl.length <= 0 && 'bg-primary'
              }`}
            >
              {imgUrl.length > 0 ? (
                <img
                  src={imgUrl[0]}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold">
                  {userData?.firstName[0]}
                  {userData?.lastName[0]}
                </span>
              )}
            </div>
            <h3 className="px-2 text-xl font-bold text-primary whitespace-nowrap">
              {userData?.firstName} {userData?.lastName}
            </h3>
          </div>
        </div>
        <div className="w-full max-w-screen-xl bg-secondary">
          <p className="p-2 text-base text-primary whitespace-nowrap">
            Created on:{' '}
            {new Date(userData?.createdOn).toLocaleString('en', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="w-full max-w-screen-xl bg-secondary">
          <p className="p-2 text-base text-primary whitespace-nowrap">
            Posts created: {userPosts.length}
          </p>
        </div>
      </div>
      <div>
        {userData?.role === 'admin' ? (
          <div className="flex flex-row my-8">
            <div>
              <button
                onClick={handleMyPostsClick}
                className="w-32 h-10 m-2 mt-0 text-sm font-bold normal-case border-none btn bg-accent text-primary hover:text-white hover:bg-primary min-w-min"
              >
                My Posts
              </button>
            </div>
            <div>
              <button
                onClick={handleUsersClick}
                className="w-32 h-10 m-2 mt-0 text-sm font-bold normal-case border-none btn bg-accent text-primary hover:text-white hover:bg-primary min-w-min"
              >
                Users
              </button>
            </div>
          </div>
        ) : (
          showMyPosts && <ProfilePosts />
        )}
      </div>
      {showMyPosts && <ProfilePosts />}
      {showUsers && <ProfileUsers />}
    </div>
  );
};

export default Profile;
