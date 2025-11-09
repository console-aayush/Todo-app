
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutPageProps {
  onLogout: () => void;
}

const LogoutPage: React.FC<LogoutPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout();          // Clear token / user session
    navigate("/login");  // Redirect to login page
  }, [onLogout, navigate]);

  return <p className="text-center mt-20">Logging out...</p>;
};

export default LogoutPage;
