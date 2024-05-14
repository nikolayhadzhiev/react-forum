import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <div className="w-full mb-16 md:px-0 h-screen flex items-center justify-center">
        <div className="bg-white flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg">
          <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
            404
          </p>
          <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
            Page Not Found
          </p>
          <p className="text-gray-500 mt-4 pb-4 border-b-2 text-center">
            Sorry, the page you are looking for could not be found.
          </p>
          <NavLink to="/">
            <button className="btn bg-accent text-primary font-bold hover:bg-primary hover:text-white border-none mt-8">
              Return Home
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NotFound;
