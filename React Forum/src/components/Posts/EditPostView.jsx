import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../../services/posts.service';

const EditPostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: '',
    content: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        setPost({
          title: postData.title,
          content: postData.content,
        });
      } catch (error) {
        console.error('Error fetching post', error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleTitleEdit = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      title: e.target.value,
    }));
  };

  const handleContentEdit = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await updatePost(postId, {
        title: post.title,
        content: post.content,
        lastUpdated: Date.now(),
      });
      navigate(-1);
      toast.success('Post was edited successfully!', {
        className: 'font-bold',
        autoClose: 3000,
      });
    } catch (error) {
      toast.warning('Error editing post!', {
        className: 'font-bold',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen mt-12 mb-12">
        <div className="items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-white un">
              EDIT POST
            </div>
            <hr
              style={{
                width: '5%',
                borderTop: '3px solid #FFC436',
                marginBottom: '50px',
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className="mb-6 text-primary">
            <div className="flex flex-col items-center mb-6">
              <label className="font-bold">Title:</label>
              <input
                type="text"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full max-w-xl p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={post.title}
                onChange={handleTitleEdit}
                required
              />
            </div>
            <div className="flex flex-col items-center mb-6">
              <label className="font-bold">Content:</label>
              <textarea
                id="content"
                rows="10"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full max-w-xl p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                value={post.content}
                onChange={handleContentEdit}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="px-4 py-2 mr-4 font-bold rounded-lg bg-accent text-primary hover:bg-primary hover:text-white"
              >
                {isLoading ? 'Updating post...' : 'Update post'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg bg-accent text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate(-1)}
              >
                ⇐ Go back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPostView;
