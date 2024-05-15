import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import DeletePostButton from './DeletePostButton';
import AppContext from '../../context/AuthContext';
import EditPostButton from './EditPostButton';
import { useNavigate } from 'react-router-dom';
import { getAllCommentsForPost } from '../../services/comments.service';
import { imageDb } from '../../config/firebase-config';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

const SinglePost = ({
  postId,
  author,
  title,
  createdOn,
  username,
  likes,
  onDelete,
}) => {
  const [postComments, setPostComments] = useState([]);
  const [initials, setInitials] = useState('');

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/posts/${postId}`);
  };

  const formatDate = (createdOn) => {
    const date = new Date(createdOn);
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

  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const allComments = await getAllCommentsForPost(postId);
        setPostComments(allComments || []);
      } catch (error) {
        console.error('Error fetching post comments', error);
      }
    };
    fetchComments();
  }, [postId]);

  useEffect(() => {
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

    const splitName = author.split(' ');
    const firstLetter = splitName[0][0];
    const secondLetter = splitName[1][0];
    setInitials(firstLetter + secondLetter);
  }, [author, username]);

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 cursor-pointer whitespace-nowrap"
        onClick={handlePostClick}
      >
        {title}
      </th>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div
            className={`grid items-center justify-center place-content-center w-12 h-12 mr-2 rounded-full shadow-2xl text-secondary ${
              imgUrl.length <= 0 && 'bg-primary'
            }`}
          >
            {imgUrl.length > 0 ? (
              <img
                src={imgUrl[0]}
                alt="Profile"
                className="object-cover w-12 h-12 rounded-full"
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full p-2 text-xl font-bold">
                {initials}
              </span>
            )}
          </div>
          <span>{author}</span>
        </div>
      </td>
      {/*<td className="px-6 py-4">{content}</td>*/}
      <td className="px-6 py-4">{formatDate(createdOn)}</td>
      <td className="px-6 py-4">{postComments.length}</td>
      {userData && (
        <>
          <td className="px-6 py-4">{likes}</td>
          <td className="px-6 py-4">
            {userData && userData.handle === username ? (
              <div className="flex">
                <EditPostButton postId={postId} />
                <DeletePostButton
                  postId={postId}
                  postUsername={username}
                  onDelete={onDelete}
                />
              </div>
            ) : (
              <div>N/A</div>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

SinglePost.propTypes = {
  postId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdOn: PropTypes.any,
  username: PropTypes.string,
  onDelete: PropTypes.func,
};

export default SinglePost;
