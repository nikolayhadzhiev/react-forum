import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import { addComment } from '../../services/comments.service';
import AppContext from '../../context/AuthContext';
import { getAllCommentsForPost } from '../../services/comments.service';

const CreateComment = ({ postId, onCreateComment }) => {
  const [commentContent, setCommentContent] = useState('');
  const [postComments, setPostComments] = useState([]);

  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const allComments = await getAllCommentsForPost(postId);
        setPostComments(allComments);
        console.log('');
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };
    fetchAllComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const author = `${userData.firstName} ${userData.lastName}`;

    try {
      const newComment = await addComment(postId, author, commentContent);
      setCommentContent('');
      onCreateComment(newComment);
      setPostComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  return (
    <>
      <section className="pt-8 antialiased bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
              Comments ({postComments.length})
            </h2>
          </div>
          <form className="mb-6" onSubmit={handleCommentSubmit}>
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
