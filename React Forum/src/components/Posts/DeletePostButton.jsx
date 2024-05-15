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

      await deletePost(postId);
      navigate('/posts');
      if (onDelete) onDelete(postId, postUsername);
      toast.success('Post was deleted successfully!', {
        className: 'font-bold',
        autoClose: 3000,
      });
    } catch (error) {
      toast.warning('Error deleting post!', {
        className: 'font-bold',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center px-4 py-2 ml-4 font-bold text-white bg-red-600 rounded-lg hover:scale-105"
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
