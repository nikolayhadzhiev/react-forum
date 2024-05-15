import { useContext, useEffect, useState } from 'react';
import SinglePost from './SinglePost';
import CreatePost from './CreatePost';
import { getAllPosts } from '../../services/posts.service';
import AppContext from '../../context/AuthContext';
import Pagination from './Pagination';
import PostsSearchbar from './PostsSearch';
import PostsFilterSort from './PostsFilterSort';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState('createdOn');
  const [sortOrder, setSortOrder] = useState('desc');

  const { userData } = useContext(AppContext);

  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts =
    filteredPosts.length > 0
      ? filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
      : posts.slice(indexOfFirstPost, indexOfLastPost);
  let totalPages = Math.ceil(
    (filteredPosts.length > 0 ? filteredPosts.length : posts.length) /
      postsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreation = (newPost) => {
    if (posts.length <= 10) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  const handlePostDeletion = (postId, postUsername) => {
    if (userData.handle === postUsername || userData.role === 'admin') {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }
  };

  const handlePostsSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.author.toLowerCase().includes(lowercasedSearchTerm)
    );

    setFilteredPosts(filteredPosts);
  };

  const handleSearchReset = () => {
    setFilteredPosts([]);
    setCurrentPage(1);
  };

  const sortPosts = (sortedPosts) => {
    return sortedPosts.slice().sort((a, b) => {
      if (sortCriteria === 'title') {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      } else if (sortCriteria === 'createdOn') {
        return (sortOrder === 'asc' ? 1 : -1) * (a.createdOn - b.createdOn);
      } else if (sortCriteria === 'comments') {
        if (sortOrder === 'asc') {
          return (
            (Object.keys(b.comments).length || 0) -
            (Object.keys(a.comments).length || 0)
          );
        } else {
          return (
            (Object.keys(a.comments).length || 0) -
            (Object.keys(b.comments).length || 0)
          );
        }
      }
    });
  };

  const handleSortChange = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('desc');
    }
  };

  const sortedPosts = sortPosts(
    filteredPosts.length > 0 ? filteredPosts : posts
  );

  if (sortedPosts.length > 0) {
    currentPosts = sortedPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    );

    totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen mt-12 mb-12 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-white un">
            FORUM POSTS
          </div>
          <hr
            style={{
              width: '5%',
              borderTop: '3px solid #FFC436',
              marginBottom: '50px',
            }}
          />
          {posts.length > 0 && (
            <div className="flex items-start justify-between w-full max-w-6xl mb-4">
              <PostsSearchbar
                onSearch={handlePostsSearch}
                onReset={handleSearchReset}
              />
              <PostsFilterSort
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                sortCriteria={sortCriteria}
              />
            </div>
          )}
          {isLoading ? (
            <p className="text-primary">Loading posts...</p>
          ) : posts.length > 0 ? (
            <>
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
                        Likes
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.map(
                      (post) =>
                        post && (
                          <SinglePost
                            key={post?.id}
                            postId={post?.id}
                            author={post?.author}
                            title={post?.title}
                            createdOn={post?.createdOn}
                            username={post?.username}
                            likes={
                              post?.likedBy
                                ? Object.keys(post?.likedBy)?.length
                                : 0
                            }
                            onDelete={handlePostDeletion}
                          />
                        )
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                <nav
                  className="flex items-center justify-between pt-8 pb-8 text-md"
                  aria-label="Table navigation"
                >
                  <span className="font-normal text-gray-500">
                    Showing{' '}
                    <span className="font-semibold text-gray-900">
                      {indexOfFirstPost + 1}-
                      {Math.min(
                        indexOfLastPost,
                        filteredPosts.length > 0
                          ? filteredPosts.length
                          : posts.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="mr-2 font-semibold text-gray-900 dark:text-white">
                      {filteredPosts.length > 0
                        ? filteredPosts.length
                        : posts.length}
                    </span>
                  </span>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </nav>
              </div>
            </>
          ) : (
            <p className="text-primary">There are no posts yet!</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full mt-10 max-w-1/2">
            {!userData?.isBlocked && (
              <CreatePost
                onPostCreate={handlePostCreation}
                postsLength={posts.length}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
