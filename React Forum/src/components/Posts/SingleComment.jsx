import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  deleteComment,
  getCommentById,
  updateComment,
} from '../../services/comments.service';
import { imageDb } from '../../config/firebase-config';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

const SingleComment = ({ postId, commentId, onDelete }) => {
  const [comment, setComment] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [imgUrl, setImgUrl] = useState([]);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const commentData = await getCommentById(postId, commentId);
        setComment(commentData);
      } catch (error) {
        console.error('Error fetching comment', error);
      }
    };
    fetchComment();
  }, [commentId, postId]);

  useEffect(() => {
    if (comment) {
      const author = comment.author;
      const username = comment.username;
      const splitName = author.split(' ');
      const firstLetter = splitName[0][0];
      const secondLetter = splitName[1][0];
      setInitials(firstLetter + secondLetter);

      listAll(ref(imageDb, `Profile pictures`)).then((images) => {
        images.items.forEach((val) => {
          const imagePathArray = val.name.split('/');
          const imageUsername = imagePathArray[0];

          if (imageUsername === username) {
            getDownloadURL(val).then((url) => {
              setImgUrl((data) => [...data, url]);
            });
          }
        });
      });
    }
  }, [comment]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedContent(comment.content);
  };

  const handleDelete = async () => {
    try {
      await deleteComment(postId, commentId);
      onDelete(commentId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await updateComment(postId, commentId, { content: editedContent });
      setComment((prevComment) => ({ ...prevComment, content: editedContent }));
    } catch (error) {
      console.error('Error updating comment', error);
    }

    setIsEditMode(false);
  };

  return (
    <div className="flex justify-center mt-2">
      <article className="p-4 text-base bg-white border-2 border-gray-100 rounded-lg min-w-1/4">
        <footer className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white">
              {imgUrl.length > 0 ? (
                <img
                  className="w-8 h-8 mr-2 rounded-full"
                  src={imgUrl[0]}
                  alt="Comment Author Avatar"
                />
              ) : (
                <span className="flex items-center justify-center w-10 h-10 text-xl font-bold border rounded-full bg-primary text-secondary border-secondary">
                  {initials}
                </span>
              )}
              <span className="ml-2">{comment.author}</span>
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(comment.createdOn)}
            </p>
          </div>
          <div className="mb-4 ml-8 dropdown dropdown-right dropdown-center bg-secondary w-fit">
            <div className="scale-150">
              <label
                tabIndex={0}
                className="pr-4 text-center border-none rounded-md cursor-pointer text-primary"
              >
                ...
              </label>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content w-32 z-[1] menu shadow bg-primary rounded-box"
            >
              <li>
                <button
                  onClick={handleEdit}
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </footer>
        <div className="text-left text-primary dark:text-gray-400">
          {isEditMode ? (
            <textarea
              id="comment"
              rows="6"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-2 text-sm font-bold border rounded resize-none text-primary border-primary focus:ring-0 focus:outline-none bg-secondary"
              placeholder="Write a comment..."
              required
            ></textarea>
          ) : (
            <p className="mt-4 ml-2">{comment.content}</p>
          )}
        </div>
        <div className="flex items-center mt-4 space-x-4 justify-left">
          {isEditMode && (
            <button
              onClick={handleSave}
              className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
            >
              <svg
                className="mr-1.5 w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                />
              </svg>
              Save
            </button>
          )}
        </div>
      </article>
    </div>
  );
};

SingleComment.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SingleComment;
