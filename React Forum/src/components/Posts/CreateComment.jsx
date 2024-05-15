import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import { addComment } from '../../services/comments.service';
import AppContext from '../../context/AuthContext';
import { getAllCommentsForPost } from '../../services/comments.service';
import { toast } from 'react-toastify';

const CreateComment = ({ postId, comments, onCreateComment }) => {
  const [commentContent, setCommentContent] = useState('');

  const { userData } = useContext(AppContext);

  const handleCommentSubmit = async (e) => {
    if (comments.length <= 5) {
      e.preventDefault();

      const author = `${userData.firstName} ${userData.lastName}`;

      try {
        const newComment = await addComment(postId, author, commentContent);
        setCommentContent('');
        onCreateComment(newComment);
        toast.success('Comment was added successfully!', {
          className: 'font-bold',
          autoClose: 3000,
        });
      } catch (error) {
        toast.warning('Error creating comment!', {
          className: 'font-bold',
          autoClose: 3000,
        });
      }
    } else {
      toast.warning("A post can't have more than 5 comments!", {
        className: 'font-bold',
        autoClose: 3000,
      });
    }
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  return (
    <>
      <section className="pt-8 antialiased bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
              Comments ({comments.length})
            </h2>
          </div>
          <form className="mb-8" onSubmit={handleCommentSubmit}>
            <div className="px-4 py-2 mb-4 bg-white border border-gray-200 rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="6"
                value={commentContent}
                onChange={handleCommentChange}
                className="w-full px-0 text-sm text-gray-900 border-0 resize-none focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-bold text-center text-gray-900 bg-accent rounded-lg hover:bg-primary hover:text-white"
            >
              POST COMMENT
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

CreateComment.propTypes = {
  postId: PropTypes.string.isRequired,
  onCreateComment: PropTypes.func.isRequired,
};

export default CreateComment;
