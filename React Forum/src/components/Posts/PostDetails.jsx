import { useState, useEffect, useContext } from 'react';
import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';
import fullHeart from '../../assets/images/heart-full.svg';
import emptyHeart from '../../assets/images/heart-empty.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById } from '../../services/posts.service';
import AppContext from '../../context/AuthContext';
import { likePost, dislikePost } from '../../services/posts.service';
import { getAllCommentsForPost } from '../../services/comments.service';
import CreateComment from './CreateComment';
import SingleComment from './SingleComment';
import { imageDb } from '../../config/firebase-config';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [isHeartScaled, setIsHeartScaled] = useState(false);
  const [imgUrl, setImgUrl] = useState([]);
  const [initials, setInitials] = useState('');

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      const author = post.author;
      const username = post.username;
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
  }, [post]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postDetails = await getPostById(postId);
        setPost(postDetails);

        if (
          userData?.handle &&
          postDetails?.likedBy &&
          postDetails?.likedBy?.[userData?.handle]
        ) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }

        const allComments = await getAllCommentsForPost(postId);
        setComments(allComments);
      } catch (error) {
        console.error('Error fetching post details', error);
      }
    };
    fetchPostAndComments();
  }, [postId, post?.likedPosts]);

  const handleClickPostLike = async () => {
    try {
      setIsHeartScaled(true);
      if (isLiked) {
        setIsLiked(false);
        await dislikePost(userData.handle, postId);
        if (likesCount > 0) {
          setLikesCount((prevCount) => prevCount - 1);
        }
      } else {
        setIsLiked(true);
        await likePost(userData.handle, postId);
        setLikesCount((prevCount) => prevCount + 1);
      }

      const updatedPostDetails = await getPostById(postId);
      setPost(updatedPostDetails);
    } catch (error) {
      console.error('Error updating post like status', error.message);
    } finally {
      setTimeout(() => {
        setIsHeartScaled(false);
      }, 100);
    }
  };

  const handleCommentCreation = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleCommentDeletion = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== deletedCommentId)
    );
  };

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

  return (
    <>
      <div className="flex flex-col min-h-screen my-12">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-3xl font-bold tracking-tight text-primary dark:text-white un">
            POST DETAILS
          </div>
          <hr
            style={{
              width: '5%',
              borderTop: '3px solid #FFC436',
              marginBottom: '50px',
            }}
          />
          <div className="w-2/3 px-6 pb-6 bg-white border-2 rounded-lg shadow-md min-w-1/2 border-gray-150 max-w-2/3 ">
            {post ? (
              <>
                <div className="flex justify-between mt-8 mb-10">
                  <div className="flex items-center justify-center">
                    {imgUrl.length > 0 ? (
                      <img
                        src={imgUrl[0]}
                        alt="Profile Avatar"
                        className="object-cover mr-2 bg-white rounded-full w-14 h-14"
                      />
                    ) : (
                      <span className="flex items-center justify-center mr-2 text-2xl font-bold text-center text-white rounded-full bg-primary w-14 h-14">
                        {initials}
                      </span>
                    )}
                    <span className="text-xl font-bold text-primary dark:text-white">
                      {post.author}
                    </span>
                  </div>
                  {userData && (
                    <span>
                      <div className="flex items-center justify-center">
                        <p className="mr-2 text-xl">
                          {post.likedBy
                            ? Object.keys(post.likedBy).length
                            : likesCount || 0}
                        </p>
                        <img
                          src={isLiked ? fullHeart : emptyHeart}
                          className={`mr-2 w-10 cursor-pointer ${
                            isHeartScaled ? 'transform scale-110' : ''
                          }`}
                          alt="Post Like Button"
                          onClick={handleClickPostLike}
                        />
                      </div>
                    </span>
                  )}
                </div>
                <div className="mb-6 break-words">
                  <h1 className="text-3xl font-bold text-primary dark:text-white">
                    {post.title}
                  </h1>
                  <p>{formatDate(post.createdOn)}</p>
                </div>
                <div className="mb-20 break-words">
                  <p className="text-primary">{post.content}</p>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-bold text-primary">
                    Last update:{' '}
                  </p>
                  <p className="text-sm text-primary/50">
                    {post.lastUpdated
                      ? formatDate(post.lastUpdated)
                      : formatDate(post.createdOn)}
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  {/*<div className="px-2 py-1 font-bold text-pink-500 bg-white border-2 border-pink-500 rounded-md">
                    <p className="text-md">
                      Likes:{' '}
                      {post.likedBy
                        ? Object.keys(post.likedBy).length
                        : likesCount || 0}
                    </p>
                  </div>*/}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 mr-4 font-bold border-2 rounded-lg bg-accent border-accent text-primary hover:bg-primary hover:text-white hover:border-primary"
                    onClick={() => navigate(-1)}
                  >
                    ⇐ Go back
                  </button>
                  {userData && userData.handle === post.username && (
                    <div className="flex">
                      <EditPostButton postId={postId} />
                      <DeletePostButton
                        postId={postId}
                        postUsername={post.username}
                        onDelete={post.onDelete}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {userData ? (
          <div>
            <CreateComment
              postId={postId}
              comments={comments}
              onCreateComment={handleCommentCreation}
            />
            {comments.length > 0 ? (
              comments
                .sort((a, b) => b.createdOn - a.createdOn)
                .map((comment) => {
                  return (
                    <SingleComment
                      key={comment.id}
                      postId={postId}
                      commentId={comment.id}
                      onDelete={handleCommentDeletion}
                    />
                  );
                })
            ) : (
              <p className="font-bold text-center text-primary">
                There are no comments yet!
              </p>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
export default PostDetails;
