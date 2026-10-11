import { Link } from 'react-router-dom';
import { EmptyState } from '../components/States';

export default function NotFound() {
  return (
    <EmptyState
      className="py-24"
      title="Page not found"
      hint="The page you are looking for does not exist."
      action={
        <Link to="/" className="btn btn-primary">
          Go to dashboard
        </Link>
      }
    />
  );
}
