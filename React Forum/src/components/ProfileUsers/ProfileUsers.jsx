import AppContext from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import {
  blockUser,
  getAllUsers,
  makeUserAdmin,
  revokeUserAdminFunctions,
  unblockUser,
} from "../../services/users.service";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from "../../config/firebase-config";
// import { format } from 'date-fns';

const ProfileUsers = () => {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return date.toLocaleDateString("en-UK", options);
    } else {
      return "Invalid Date";
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
        console.error(error);
      });
  };

  const handleUnblock = (user) => {
    unblockUser(user.handle)
      .then(() => {
        fetchAllUsers();
      })
      .catch((error) => {
        console.error(error);
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
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });


  return (
    <div className="flex flex-col items-center justify-center bg-secondary shadow shadow-2xl text-primary rounded-md px-42 mx-48 border border-primary max-h-max w-max">
      {/* Search bar */}
      <div className="bg-white mr-2">
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

      {/* Table with the users */}
      <table>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Profile Picture</th>
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
              Phone Number
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
        <tbody className="shadow shadow-2xl items-center justify-between">
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className={
                user.isBlocked
                  ? "bg-error"
                  : user.role === "admin"
                  ? "bg-success"
                  : "bg-white"
              }
            >
              <td className="w-max h-14 border border-primary  items-center justify-center">
                {imgUrl.some((item) => item.photoName === user.handle) ? (
                  <img
                    src={
                      imgUrl.find((item) => item.photoName === user.handle)?.url
                    }
                    alt={`Profile Avatar for ${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full border border-primary"
                  />
                ) : (
                  <span className="text-2xl text-center font-bold p-2 rounded-full border border-primary w-14 h-14 bg-secondary">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                )}
              </td>
              <td className="border border-primary w-full text-center">{`${user.firstName} ${user.lastName}`}</td>
              <td className="border border-primary w-full text-center">{`${user.handle}`}</td>
              <td className="border border-primary w-full text-center">
                {user.email}
              </td>
              <td className="border border-primary w-full text-center">
                {user.phoneNumber}
              </td>
              <td className="border border-primary w-full text-center">
                {formatDate(user.createdOn)}
              </td>
              <td className="border border-primary w-full text-center">
                {
                  Object.values(user.likedPosts ?? {}).filter((value) => value)
                    .length
                }
              </td>
              <td className="border border-primary w-max min-w-60 h-16 items-center justify-center">
                {userData.handle === user.handle ? (
                  <p className="text-center w-60 min-w-96">My Account</p>
                ) : (
                  <div className="flex flex-row w-max min-w-60">
                    {user.role === "admin" && !user.isBlocked ? (
                      <>
                        <button
                          className="btn btn-primary border-primary mx-2 bg-red-600 text-secondary"
                          onClick={() => handleRevoke(user)}
                        >
                          Revoke Admin
                        </button>
                        <p className="text-3xl">|</p>
                      </>
                    ) : !user.isBlocked ? (
                      <>
                        <button
                          className="btn btn-primary border-primary mx-2 bg-green-600 text-secondary"
                          onClick={() => handleAdmin(user)}
                        >
                          Make Admin
                        </button>
                        <p className="text-3xl">|</p>
                      </>
                    ) : null}

                    {user.isBlocked ? (
                      <button
                        className="btn btn-primary border-primary mx-2 bg-green-600 text-secondary"
                        onClick={() => handleUnblock(user)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary border-primary mx-2 bg-red-600 text-secondary"
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
  );
};

export default ProfileUsers;
