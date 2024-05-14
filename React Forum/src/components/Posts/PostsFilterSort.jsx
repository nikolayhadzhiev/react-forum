import PropTypes from 'prop-types';

const PostsFilterSort = ({ onSortChange, sortOrder, sortCriteria }) => {
  const handleSortChange = (e) => {
    const newSortCriteria = e.target.value;
    onSortChange(newSortCriteria);
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="text-gray-700 dark:text-gray-300">Sort By:</label>
      <select
        value={sortCriteria}
        onChange={handleSortChange}
        className="bg-white border-2 border-gray-300 rounded-md px-3 py-1 focus:outline-none"
      >
        <option value="createdOn">Created On</option>
        <option value="title">Title</option>
        <option value="comments">Comments</option>
      </select>
      <label className="text-gray-700 dark:text-gray-300">Order:</label>
      <select
        value={sortOrder}
        onChange={() => onSortChange(sortCriteria)}
        className="bg-white border-2 border-gray-300 rounded-md px-3 py-1 focus:outline-none"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

PostsFilterSort.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortCriteria: PropTypes.string.isRequired,
};

export default PostsFilterSort;
