import { ref, push, get, update, remove, set } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addComment = async (postId, author, content, username) => {
  try {
    const commentsRef = ref(db, `commentsTest/${postId}`);
    const newCommentRef = push(commentsRef, {
      author,
      content,
      createdOn: Date.now(),
      username,
    });

    const commentId = newCommentRef.key;

    const postSnapshot = await get(ref(db, `postsTest/${postId}`));
    const post = postSnapshot.val();

    const updatedComments = { ...(post.comments || {}), [commentId]: true };
    await set(ref(db, `postsTest/${postId}/comments`), updatedComments);

    await newCommentRef;

    return await getCommentById(postId, commentId);
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getCommentById = async (postId, commentId) => {
  try {
    const commentRef = ref(db, `commentsTest/${postId}/${commentId}`);
    const comment = await get(commentRef);

    if (!comment.exists()) {
      throw new Error(`Comment with id ${commentId} does not exist!`);
    }

    const commentData = comment.val();
    commentData.id = commentId;

    return commentData;
  } catch (error) {
    console.error('Error getting comment', error.message);
  }
};

export const updateComment = async (postId, commentId, updateData) => {
  try {
    const commentRef = ref(db, `commentsTest/${postId}/${commentId}`);
    await update(commentRef, updateData);

    return await getCommentById(postId, commentId);
  } catch (error) {
    console.error('Error updating comment', error.message);
    throw error;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    // await remove(ref(db, `commentsTest/${postId}/${commentId}`));
    // await remove(ref(db, `postsTest/${postId}/${commentId}`));

    const updateComments = {};
    updateComments[`/postsTest/${postId}/comments/${commentId}`] = null;
    updateComments[`/commentsTest/${postId}/${commentId}`] = null;

    return update(ref(db), updateComments);
  } catch (error) {
    console.error('Error deleting comment', error.message);
    throw error;
  }
};

export const getAllCommentsForPost = async (postId) => {
  try {
    const commentsRef = ref(db, `commentsTest/${postId}`);
    const comments = await get(commentsRef);

    if (!comments.exists()) {
      return [];
    }

    return Object.keys(comments.val()).map((commentId) => {
      const comment = comments.val()[commentId];
      return { ...comment, id: commentId };
    });
  } catch (error) {
    console.error('Error getting comments', error.message);
    throw error;
  }
};

export const getAllCommentsCount = async () => {
  try {
    const commentsSnapshot = await get(ref(db, 'commentsTest'));

    if (commentsSnapshot.exists()) {
      return Object.values(commentsSnapshot.val()).flatMap((postComments) =>
        Object.values(postComments)
      ).length;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching created comments count:', error.message);
    return 0;
  }
};

export const getAllPostsWithComments = () => {
  try {
    return get(ref(db, `commentsTest`)).then((commentsRef) => {
      const comments = commentsRef.val() || {};

      if (comments) {
        return Promise.all(
          Object.keys(comments).map((postId) => {
            return get(ref(db, `postsTest/${postId}`)).then((snapshot) => {
              const post = snapshot.val();
              return {
                ...post,
                id: postId,
                comments: commentsRef.val()[postId] || {},
              };
            });
          })
        );
      }

      return comments;
    });
  } catch (error) {
    console.error('Error getting comments', error.message);
    return [];
  }
};
