import AppContext from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { getPostsByAuthor } from '../../services/posts.service';
import SinglePost from '../Posts/SinglePost';

const ProfilePosts = () => {
  const { userData } = useContext(AppContext);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (userData?.handle) {
      getPostsByAuthor(userData.handle)
        .then((posts) => {
          setUserPosts(posts);
          console.log(posts);
        })
        .catch((error) => {
          console.error('Error getting posts', error.message);
        });
    }
  }, [userData?.handle]);

  const handlePostDeletion = (postId, postUsername) => {
    if (userData.handle === postUsername || userData.role === 'admin') {
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    }
  };

  return (
    <div className="w-full max-w-6xl overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-primary dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Author
            </th>
            <th scope="col" className="px-6 py-3">
              Created On
            </th>
            <th scope="col" className="px-6 py-3">
              Comments
            </th>
            <th scope="col" className="px-6 py-3">
              Likes
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post) => (
            <SinglePost
              key={post.id}
              postId={post.id}
              author={post.author}
              title={post.title}
              createdOn={post.createdOn}
              username={post.username}
              likes={post?.likedBy ? Object.keys(post?.likedBy)?.length : 0}
              onDelete={handlePostDeletion}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePosts;
