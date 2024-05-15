import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { addPost } from '../../services/posts.service.js';
import AppContext from '../../context/AuthContext.js';
import {
  POST_TITLE_MIN_LENGTH,
  POST_TITLE_MAX_LENGTH,
  POST_CONTENT_MIN_LENGTH,
  POST_CONTENT_MAX_LENGTH,
} from '../../common/constants.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = ({ onPostCreate, postsLength }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { userData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    if (postsLength <= 10) {
      e.preventDefault();

      if (!title) {
        toast.warning('Post title is required!', {
          autoClose: 3000,
          className: 'font-bold',
        });
        return;
      }

      if (
        title.length < POST_TITLE_MIN_LENGTH ||
        title.length > POST_TITLE_MAX_LENGTH
      ) {
        toast.warning(
          `Post title must contain between ${POST_TITLE_MIN_LENGTH} and ${POST_TITLE_MAX_LENGTH} characters!`,
          {
            autoClose: 3000,
            className: 'font-bold',
          }
        );
        return;
      }

      if (!content) {
        toast.warning('Post content is required!', {
          autoClose: 3000,
          className: 'font-bold',
        });
        return;
      }

      if (
        content.length < POST_CONTENT_MIN_LENGTH ||
        content.length > POST_CONTENT_MAX_LENGTH
      ) {
        toast.warning(
          `Post title must contain between ${POST_CONTENT_MIN_LENGTH} and ${POST_CONTENT_MAX_LENGTH} characters!`,
          {
            autoClose: 3000,
            className: 'font-bold',
          }
        );
        return;
      }

      const author = `${userData.firstName} ${userData.lastName}`;
      const username = userData.handle;

      setIsLoading(true);

      try {
        const newPost = await addPost(author, username, title, content);
        setTitle('');
        setContent('');
        onPostCreate(newPost);
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("Can't create more than 10 posts!", {
        className: 'font-bold',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6 text-primary">
        <div className="flex flex-col items-center mb-8">
          <label className="mb-2 font-bold">Title:</label>
          <input
            type="text"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full max-w-xl p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center mb-6">
          <label className="mb-2 font-bold">Content:</label>
          <textarea
            id="content"
            rows="6"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full max-w-xl p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
            placeholder="Enter content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="px-4 py-2 font-bold rounded-lg bg-accent text-primary hover:bg-primary hover:text-white"
          >
            {isLoading ? 'Creating new post...' : 'Create Post'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

CreatePost.propTypes = {
  onPostCreate: PropTypes.func.isRequired,
};

export default CreatePost;
