import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-navy px-4 py-8 text-soft-neon">
      <div className="glass-effect rounded-2xl p-6 sm:p-10 text-center max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-neon">404</h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-soft-neon/80">The page you requested could not be found.</p>
        <Link to="/" className="btn-secondary mt-5 sm:mt-6 inline-flex w-full sm:w-auto text-xs sm:text-sm">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
