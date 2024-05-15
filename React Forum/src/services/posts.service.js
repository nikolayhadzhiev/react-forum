import {
  ref,
  push,
  get,
  query,
  orderByChild,
  update,
  remove,
  startAt,
  endAt,
  set,
} from 'firebase/database';
import { db } from '../config/firebase-config';

const fromPostsDocument = (snapshot) => {
  const postsDocument = snapshot.val();

  return Object.keys(postsDocument).map((key) => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
      comments: post.comments ? Object.keys(post.comments) : {},
    };
  });
};

export const addPost = async (
  author,
  username,
  title,
  content,
  comments = {},
  likedBy = {},
  postTags = {}
) => {
  try {
    const postsRef = ref(db, 'postsTest');
    const newPostRef = push(postsRef, {
      author,
      username,
      title,
      content,
      comments: comments || {},
      likedBy: likedBy || {},
      createdOn: Date.now(),
      postTags: postTags || {},
    });

    const postId = newPostRef.key;

    const commentsRef = ref(db, `commentsTest/${postId}`);
    const commentsSnapshot = await get(commentsRef);
    const existingComments = commentsSnapshot.val() || {};

    await set(ref(db, `postsTest/${postId}/comments`), existingComments);

    const newPost = await getPostById(postId);

    return newPost;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

export const getPostById = (id) => {
  return get(ref(db, `postsTest/${id}`))
    .then((result) => {
      if (!result.exists()) {
        throw new Error(`Post with id ${id} does not exist!`);
      }

      const post = result.val();
      post.id = id;
      // // post.category = post.categoryId;
      // if (!post.tags) post.tags = {};

      return post;
    })
    .catch((error) => {
      console.error('Error getting post', error.message);
    });
};

export const deletePost = async (postId) => {
  try {
    const postRef = ref(db, `postsTest/${postId}`);
    const postSnapshot = await get(postRef);

    if (!postSnapshot.exists()) {
      console.error(`Post with id ${postId} does not exist!`);
      return;
    }

    const post = postSnapshot.val();

    if (post.likedBy) {
      const likedByHandles = Object.keys(post.likedBy);

      likedByHandles.forEach(async (handle) => {
        const userLikedPostsRef = ref(
          db,
          `users/${handle}/likedPosts/${postId}`
        );
        await remove(userLikedPostsRef);
      });
    }

    await remove(postRef);
  } catch (error) {
    console.error('Error deleting post', error.message);
    throw error;
  }
};

export const updatePost = async (postId, updateData) => {
  try {
    const postRef = ref(db, `postsTest/${postId}`);
    await update(postRef, updateData);

    return await getPostById(postId);
  } catch (error) {
    console.error('Error updating post', error.message);
    throw error;
  }
};

export const getLikedPosts = (handle) => {
  return get(ref(db, `users/${handle}`)).then((snapshot) => {
    if (!snapshot.val()) {
      throw new Error(`User with handle @${handle} does not exist!`);
    }

    const user = snapshot.val();
    if (!user.likedPosts) return [];

    return Promise.all(
      Object.keys(user.likedPosts).map((key) => {
        return get(ref(db, `postsTest/${key}`))
          .then((snapshot) => {
            const post = snapshot.val();

            return {
              ...post,
              createdOn: new Date(post.createdOn),
              id: key,
              likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
            };
          })
          .catch((error) => {
            console.error('Error getting post', error.message);
          });
      })
    );
  });
};

export const getPostsByAuthor = (handle) => {
  return get(query(ref(db, 'postsTest')))
    .then((snapshot) => {
      if (!snapshot.exists()) return [];

      const postsArray = fromPostsDocument(snapshot);
      return postsArray.filter((post) => post.username === handle).reverse();
    })
    .catch((error) => {
      console.error('Error getting posts', error.message);
      return [];
    });
};

export const getAllPosts = () => {
  return get(ref(db, 'postsTest'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return fromPostsDocument(snapshot).reverse();
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error('Error getting posts', error.message);
      return [];
    });
};

export const getAllPostsCount = async () => {
  try {
    const postsSnapshot = await get(ref(db, 'postsTest'));

    if (postsSnapshot.exists()) {
      const postsCount = postsSnapshot.size;
      return postsCount;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching created posts count:', error.message);
    return 0;
  }
};

export const getAllPostsFromUser = (authorId) => {
  const postsRef = ref(db, 'postsTest');

  return get(postsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        const postsData = snapshot.val();

        const postsArray = Object.entries(postsData).map(
          ([postId, postData]) => ({
            id: postId,
            ...postData,
          })
        );

        if (authorId) {
          return postsArray.filter((post) => post.authorId === authorId);
        } else {
          return postsArray;
        }
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error('Error getting posts', error.message);
      return [];
    });
};

export const likePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/postsTest/${postId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

  return update(ref(db), updateLikes);
};

export const dislikePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`postsTest/${postId}/likedBy/${handle}`] = null;
  updateLikes[`users/${handle}/likedPosts/${postId}`] = null;

  return update(ref(db), updateLikes);
};

export const filteredPosts = async (query) => {
  const posts = await getAllPosts();
  const queryToLowerCase = query.queryToLowerCase();
  const filteredPosts = posts.filter((post) =>
    post.title.queryToLowerCase().includes(queryToLowerCase)
  );
  return filteredPosts;
};
