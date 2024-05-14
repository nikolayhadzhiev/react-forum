import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const EditPostButton = ({ postId }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <button
      onClick={handleEdit}
      className="inline-flex items-center justify-center bg-green-600 w-24 text-white py-2 px-4 rounded-lg font-bold hover:scale-105"
    >
      <svg
        aria-hidden="true"
        className="mr-1 -ml-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
        <path
          fillRule="evenodd"
          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          clipRule="evenodd"
        ></path>
      </svg>
      Edit
    </button>
  );
};

EditPostButton.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default EditPostButton;
