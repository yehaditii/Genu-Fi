import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-navy px-6 text-soft-neon">
      <div className="glass-effect rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-neon">404</h1>
        <p className="mt-3 text-soft-neon/80">The page you requested could not be found.</p>
        <Link to="/" className="btn-secondary mt-6 inline-flex">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
