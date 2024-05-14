import { useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import { getAllPostsWithComments } from '../../services/comments.service';

const TenMostCommentedPosts = () => {
  const [mostCommentedPosts, setMostCommentedPosts] = useState([]);

  useEffect(() => {
    const fetchMostCommentedPosts = async () => {
      try {
        const allComments = await getAllPostsWithComments();

        const sortedComments = allComments.sort(
          (a, b) =>
            Object.keys(b.comments).length - Object.keys(a.comments).length
        );

        const tenMostCommentedPosts = sortedComments
          .slice(0, 10)
          .filter((post) => post.author);
        setMostCommentedPosts(tenMostCommentedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };
    fetchMostCommentedPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen mt-12 mb-12 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-white un">
            10 MOST COMMENTED POSTS
          </div>
          <hr
            style={{
              width: '5%',
              borderTop: '3px solid #FFC436',
              marginBottom: '50px',
            }}
          />
          {mostCommentedPosts.length > 0 ? (
            <div className="w-full overflow-x-auto shadow-md max-w-7xl sm:rounded-lg">
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
                  {mostCommentedPosts.map((post) => (
                    <SinglePost
                      key={post.id}
                      postId={post.id}
                      author={post.author}
                      title={post.title}
                      createdOn={post.createdOn}
                      comments={post.comments}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-primary">There are no posts yet!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TenMostCommentedPosts;
