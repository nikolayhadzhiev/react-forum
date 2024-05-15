import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { getAllPosts } from '../../services/posts.service';

const TenMostRecentPosts = () => {
  const [mostRecentPosts, setMostRecentPosts] = useState([]);

  useEffect(() => {
    const fetchMostRecentPosts = async () => {
      try {
        const allPosts = await getAllPosts();

        const sortedPosts = allPosts.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );

        const tenMostRecentPosts = sortedPosts.slice(0, 10);
        setMostRecentPosts(tenMostRecentPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };
    fetchMostRecentPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen mt-12 mb-12">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-white un">
            10 MOST RECENT POSTS
          </div>
          <hr
            style={{
              width: '5%',
              borderTop: '3px solid #FFC436',
              marginBottom: '50px',
            }}
          />
          {mostRecentPosts.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {mostRecentPosts.map((post) => (
                    <SinglePost
                      key={post.id}
                      postId={post.id}
                      author={post.author}
                      title={post.title}
                      createdOn={post.createdOn}
                      comments={post.comments}
                      username={post.username}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-primary">There are no recent posts yet!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TenMostRecentPosts;
