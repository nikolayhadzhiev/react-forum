import PropTypes from 'prop-types';
import { useState } from 'react';

const PostsSearchbar = ({ onSearch, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    onSearch('');
    onReset('');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
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
              placeholder="Search for items"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-accent text-primary py-2 px-4 rounded-lg font-bold hover:bg-primary hover:text-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </>
  );
};

PostsSearchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default PostsSearchbar;
