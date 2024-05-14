import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <ul className="inline-flex -space-x-px text-sm h-8">
      {pageNumbers.map((number) => (
        <li key={number}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onPageChange(number);
            }}
            className={`flex items-center justify-center px-3 h-8 ${
              currentPage === number
                ? 'text-blue-600 bg-blue-50 font-bold'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
