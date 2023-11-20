import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const CLIENT_ID = "8eb6bf3cd4e049039d96b5158208a1e9";
const REDIRECT_URL = "http://localhost:5173";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE =
  "user-read-private user-read-email playlist-modify-private playlist-modify-public";

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((e) => e.startsWith("access_token"))
        .split("=")[1];
      setToken(token);
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="container text-center">
      <h1>My Playlist</h1>
      <a
        className="btn btn-success"
        href={`${AUTH_ENDPOINT}?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URL}`}
      >
        Login
      </a>
    </div>
  );
};

export default Login;
