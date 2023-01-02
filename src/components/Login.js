import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";

const Login = ({ setUserLogin, setToken, setUserId }) => {
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const navigate = useNavigate();

    const logIn = async (e) => {
        e.preventDefault();
        await axios.post('http://162.19.66.62:3001/login',
            {
                userName: currentUserName,
                password: currentPassword
            }
        ).then((res) => {

            if (res.data.status === 'OK') {
                console.log(res.data)
                const token = res.data.token;
                setUserId(res.data.userId);
                setUserLogin(true);
                setToken(token);
                setErrorPassword(false);
                localStorage.setItem('token', JSON.stringify({ token: token, userId: res.data.user }))
            } else {
                setErrorPassword(true);
            }
        }
        );
    }

    return (
        <div className="col-md-3 mx-auto">
            {errorPassword ? <Alert variant="danger">Password or username not correct</Alert> : null}
            <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" onChange={(e) => {
                        setCurrentUserName(e.target.value);
                        setErrorPassword(false)
                    }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setErrorPassword(false)
                    }} />
                    <Form.Text onClick={() => navigate('/register')} className="linkColor" >New User?</Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={logIn}>
                    Submit
                </Button>
            </Form >
        </div >)
}

export default Login