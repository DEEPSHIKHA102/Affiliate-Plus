import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/actions";

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axios.post(`${serverEndpoint}/auth/logout`, {}, {
                withCredentials: true
            });
            dispatch({
                type: CLEAR_USER
            });
        } catch (error) {
            console.log(error);
            navigate('/error');
        }
    };

    useEffect(() => {
        handleLogout();
    }, []);
}

export default Logout;