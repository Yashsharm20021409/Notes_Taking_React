import { Navigate ,useNavigate} from "react-router-dom"
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {

    const isAuthenticated = Cookies.get('token');
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
    }
    return children;
};

export default ProtectedRoute;