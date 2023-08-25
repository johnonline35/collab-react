import io from "socket.io-client";
const socket = io("https://collab-express-production.up.railway.app/");
export default socket;
