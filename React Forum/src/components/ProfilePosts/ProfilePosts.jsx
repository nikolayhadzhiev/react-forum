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
        })
        .catch((error) => {
          console.error('Error getting posts', error.message);
        });
    }
  }, [userData?.handle]);

  return (
    <div className="justify-center relative align-center bg-secondary shadow shadow-2xl text-primary rounded-md px-42 mx-48 border border-primary max-h-max w-max">
      <table>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Author
            </th>
            {/* <th scope="col" className="px-6 py-3">
                        Content
                      </th>*/}
            <th scope="col" className="px-6 py-3">
              Created On
            </th>
            <th scope="col" className="px-6 py-3">
              Comments
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
              // onDelete={handlePostDeletion}
            />
          ))}
        </tbody>
      </table>
      <div
        style={{
          borderBottom: '2px solid #0A2A4C',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      ></div>
    </div>
  );
};

export default ProfilePosts;
