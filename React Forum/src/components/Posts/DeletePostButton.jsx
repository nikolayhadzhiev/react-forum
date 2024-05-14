import PropTypes from 'prop-types';
import { deletePost } from '../../services/posts.service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeletePostButton = ({ postId, postUsername, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await deletePost(postId);
      navigate('/posts');
      if (onDelete) onDelete(postId, postUsername);
    } catch (error) {
      console.error('Error deleting post:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:scale-105 ml-4"
    >
      <svg
        aria-hidden="true"
        className="w-5 h-5 mr-1.5 -ml-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        ></path>
      </svg>
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

DeletePostButton.propTypes = {
  postId: PropTypes.string.isRequired,
  postUsername: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default DeletePostButton;
