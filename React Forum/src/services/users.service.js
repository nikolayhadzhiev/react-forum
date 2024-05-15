import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (
  handle,
  firstName,
  lastName,
  phoneNumber,
  uid,
  email,
  role
) => {
  return set(ref(db, `users/${handle}`), {
    uid,
    handle,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    isBlocked: false,
    createdOn: Date.now(),
    likedPosts: {},
    comments: {},
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getRegisteredUsersCount = async () => {
  try {
    const usersSnapshot = await get(ref(db, 'users'));

    if (usersSnapshot.exists()) {
      const usersCount = usersSnapshot.size;
      return usersCount;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching registered users count:', error.message);
    return 0;
  }
};

export const getAllUsers = async () => {
  try {
    const userRef = ref(db, `users`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const usersData = userSnapshot.val();
      const usersArray = Object.keys(usersData).map((userId) => ({
        id: userId,
        ...usersData[userId],
      }));
      return usersArray;
    } else {
      throw new Error(`Users not found`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const blockUser = async (handle) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      await set(userRef, {
        ...userSnapshot.val(),
        isBlocked: true,
      });
    }
  } catch (error) {
    throw new Error('Error blocking user!');
  }
};

export const unblockUser = async (handle) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      await set(userRef, {
        ...userSnapshot.val(),
        isBlocked: false,
      });
    }
  } catch (error) {
    throw new Error('Error unblocking user!');
  }
};

export const makeUserAdmin = async (handle) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      await set(userRef, {
        ...userSnapshot.val(),
        role: 'admin',
      });
    }
  } catch (error) {
    console.error('Error making user admin:', error.message);
  }
};

export const revokeUserAdminFunctions = async (handle) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      await set(userRef, {
        ...userSnapshot.val(),
        role: 'user',
      });
    }
  } catch (error) {
    console.error('Error revoking user:', error.message);
  }
};
