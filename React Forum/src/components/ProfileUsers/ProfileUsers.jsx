import AppContext from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import {
  blockUser,
  getAllUsers,
  makeUserAdmin,
  revokeUserAdminFunctions,
  unblockUser,
} from '../../services/users.service';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { imageDb } from '../../config/firebase-config';
import { toast } from 'react-toastify';
// import { format } from 'date-fns';

const ProfileUsers = () => {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    listAll(ref(imageDb, `Profile pictures`)).then((images) => {
      images.items.forEach((val) => {
        const photoName = val.name;
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => [...data, { url, photoName }]);
        });
      });
    });
  }, []);

  const formatDate = (createdOn) => {
    const date = new Date(createdOn);

    if (!isNaN(date.getTime())) {
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      return date.toLocaleDateString('en-UK', options);
    } else {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {}, [users]);

  const fetchAllUsers = () => {
    getAllUsers()
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleBlock = (user) => {
    blockUser(user.handle)
      .then(() => {
        fetchAllUsers();
      })
      .catch((error) => {
        toast.error(error, {
          autoClose: 3000,
          className: 'font-bold',
        });
      });
  };

  const handleUnblock = (user) => {
    unblockUser(user.handle)
      .then(() => {
        fetchAllUsers();
      })
      .catch((error) => {
        toast.error(error, {
          autoClose: 3000,
          className: 'font-bold',
        });
      });
  };

  const handleAdmin = (user) => {
    makeUserAdmin(user.handle)
      .then(() => {
        fetchAllUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRevoke = (user) => {
    revokeUserAdminFunctions(user.handle)
      .then(() => {
        fetchAllUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filteredUsers = users.filter((user) => {
    if (searchTerm) {
      return (
        user.phoneNumber.includes(searchTerm) ||
        user.email.includes(searchTerm) ||
        user.handle.includes(searchTerm) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  return (
    <>
      {/* Search bar */}
      <div className="mb-4 bg-white">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center max-w-6xl mx-48 mb-10 border rounded-md shadow-2xl bg-secondary text-primary px-42 border-primary max-h-max">
        {/* Table with the users */}
        <div className="w-full max-w-6xl overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-primary">
            <thead className="text-xs text-white uppercase bg-primary dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Created On
                </th>
                <th scope="col" className="px-6 py-3">
                  Liked Posts
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="items-center justify-between shadow-2xl">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={
                    user.isBlocked
                      ? 'bg-red-100'
                      : user.role === 'admin'
                      ? 'bg-green-100'
                      : 'bg-white'
                  }
                >
                  <td className="px-6 py-4">
                    <div className="grid items-center justify-center w-12 h-12 place-content-center">
                      {imgUrl.some((item) => item.photoName === user.handle) ? (
                        <img
                          src={
                            imgUrl.find(
                              (item) => item.photoName === user.handle
                            )?.url
                          }
                          alt={`Profile Avatar for ${user.firstName} ${user.lastName}`}
                          className="object-cover w-12 h-12 rounded-full"
                        />
                      ) : (
                        <span className="w-12 h-12 p-2 text-xl font-bold text-center text-white rounded-full bg-primary">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-6 py-4">{`${user.handle}`}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{formatDate(user.createdOn)}</td>
                  <td className="px-6 py-4">
                    {
                      Object.values(user.likedPosts ?? {}).filter(
                        (value) => value
                      ).length
                    }
                  </td>
                  <td className="px-6 py-4">
                    {userData.handle === user.handle ? (
                      <p className="font-bold uppercase">My Account</p>
                    ) : (
                      <div className="flex flex-row text-xs">
                        {user.role === 'admin' && !user.isBlocked ? (
                          <>
                            <button
                              className="inline-flex items-center px-4 py-2 ml-4 font-bold text-white uppercase bg-red-600 rounded-lg hover:scale-105"
                              onClick={() => handleRevoke(user)}
                            >
                              Revoke Admin
                            </button>
                          </>
                        ) : !user.isBlocked ? (
                          <>
                            <button
                              className="inline-flex items-center justify-center w-24 px-4 py-2 font-bold text-white uppercase bg-green-600 rounded-lg hover:scale-105"
                              onClick={() => handleAdmin(user)}
                            >
                              Make Admin
                            </button>
                          </>
                        ) : null}

                        {user.isBlocked ? (
                          <button
                            className="inline-flex items-center justify-center w-24 px-4 py-2 font-bold text-white uppercase bg-green-600 rounded-lg hover:scale-105"
                            onClick={() => handleUnblock(user)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center px-4 py-2 ml-4 font-bold text-white uppercase bg-red-600 rounded-lg hover:scale-105"
                            onClick={() => handleBlock(user)}
                          >
                            Block
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProfileUsers;
