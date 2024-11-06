import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUserName = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const login = async (e) => {
        const payload = {
            username,
            password
        }

        const response = await axios.post('http://localhost:3000/v1/signin',payload);
        if(response.status == 200){
            sessionStorage.setItem('token', response.data.token);
            navigate('/canvas');
        }
    }
    return <div style={{
        display: "flex",
        gap: '10px'
    }}>
        <input type="text" onChange={handleUserName} placeholder="user name"></input>
        <input type="password" onChange={handlePassword} placeholder="password"></input>
        <button onClick={login}>Login</button>
    </div>
}