import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-wrapper">
      <div className="nf-card">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Oops! Page Not Found</h2>
        <p className="nf-text">
          The page you're looking for might have been removed,
          renamed, or temporarily unavailable.
        </p>
        <Link to="/" className="nf-button">Go Back Home</Link>
      </div>
    </div>
  );
}