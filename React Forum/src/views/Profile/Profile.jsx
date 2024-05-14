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
    <div className="p-4 flex flex-col min-h-screen items-center">
      <div className="flex flex-col relative top-0 min-w-max bg-secondary justify-center align-center shadow shadow-2xl w-96 basis 1/2 rounded-md h-48 border border-primary mb-4">
        <div className="w-14 rounded-full">
          <div className="avatar placeholder p-2  items-center">
            <div className="bg-primary text-secondary border border-primary rounded-full w-14 shadow-2xl">
              {imgUrl.length > 0 ? (
                <img
                  src={imgUrl[0]}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold">
                  {userData?.firstName[0]}
                  {userData?.lastName[0]}
                </span>
              )}
            </div>
            <h3 className="text-primary text-xl px-2 whitespace-nowrap">
              {userData?.firstName} {userData?.lastName}
            </h3>
          </div>
        </div>
        <div className="h-0.5 bg-accent mx-2"></div>
        <div className="bg-secondary w-full max-w-screen-xl">
          <p className="text-primary text-xl p-2 whitespace-nowrap">
            created on: {new Date(userData?.createdOn).toLocaleDateString()}
          </p>
        </div>
        <div className="h-0.5 bg-accent mx-2"></div>
        <div className="bg-secondary w-full max-w-screen-xl">
          <p className="text-primary text-xl p-2 whitespace-nowrap">
            Posts created: {userPosts.length}
          </p>
        </div>
      </div>
      <div>
        {userData?.role === 'admin' ? (
          <div className="flex flex-row">
            <div>
              <button
                onClick={handleMyPostsClick}
                className="btn hover:bg-accent border-none hover:text-primary font-bold min-w-min text-white text-sm w-32 h-10 m-10"
              >
                My Posts
              </button>
            </div>
            <div>
              <button
                onClick={handleUsersClick}
                className="btn hover:bg-accent border-none hover:text-primary font-bold min-w-min text-white text-sm w-32 h-10 m-10"
              >
                Users
              </button>
            </div>
          </div>
        ) : (
          <ProfilePosts></ProfilePosts>
        )}
      </div>
      {showMyPosts && <ProfilePosts />}
      {showUsers && <ProfileUsers />}
    </div>
  );
};

export default Profile;
