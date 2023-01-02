import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";

import RegisterSucceded from './RegisterSucceded';

const Register = () => {
    const navigate = useNavigate();
    const [registrationError, setRegistrationError] = useState(false);
    const [registerSucceded, setRegisterSucceded] = useState(false);
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');

    const fontTypeUserNameLenght = currentUserName.length > 5 ? 'greenFont' : 'redFont';
    const fontTypeUserNameNumber = /\d/.test(currentUserName) ? 'greenFont' : 'redFont';
    const fontTypeUserEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(currentEmail) ? 'greenFont' : 'redFont';
    const fontTypePasswordLength = currentPassword.length > 5 ? 'greenFont' : 'redFont';
    const fontTypePasswordNumber = /\d/.test(currentPassword) ? 'greenFont' : 'redFont';
    const fontTypePasswordUsername = currentPassword !== currentUserName ? 'greenFont' : 'redFont';
    const fontTypePasswordConfirmLength = currentPasswordConfirm.length > 5 ? 'greenFont' : 'redFont';
    const fontTypePasswordConfirmNumber = /\d/.test(currentPasswordConfirm) ? 'greenFont' : 'redFont';
    const fontTypePasswordConfirmPassword = currentPassword === currentPasswordConfirm ? 'greenFont' : 'redFont';
    const fontTypePasswordConfirmUsername = currentPasswordConfirm !== currentUserName ? 'greenFont' : 'redFont';

    const popOverUserName = (
        (<Popover id="popover-basic">
            <Popover.Header as="h6">Username Conditions</Popover.Header>
            <Popover.Body>
                <p className={fontTypeUserNameLenght}>The username should contains at least 5 characters</p>
                <p className={fontTypeUserNameNumber}>The username should contains at least 1 number</p>
            </Popover.Body>
        </Popover>)
    )
    const popOverEmail = (
        (<Popover id="popover-basic">
            <Popover.Header as="h6">Email Conditions</Popover.Header>
            <Popover.Body>
                <p className={fontTypeUserEmail}>The email format should be: email@server.com</p>
            </Popover.Body>
        </Popover>)
    )
    const popOverPassword = (
        (<Popover id="popover-basic">
            <Popover.Header as="h6">Password Conditions</Popover.Header>
            <Popover.Body>
                <p className={fontTypePasswordLength}>The password should contains at least 5 characters</p>
                <p className={fontTypePasswordNumber}>The password should contains at least 1 number</p>
                <p className={fontTypePasswordUsername}>The password should be different to the Username</p>
            </Popover.Body>
        </Popover>)
    )
    const popOverPasswordConfirm = (
        (<Popover id="popover-basic">
            <Popover.Header as="h6">Password Conditions</Popover.Header>
            <Popover.Body>
                <p className={fontTypePasswordConfirmLength}>The password should contains at least 5 characters</p>
                <p className={fontTypePasswordConfirmNumber}>The password should contains at least 1 number</p>
                <p className={fontTypePasswordConfirmUsername}>The password should be different to the Username</p>
                <p className={fontTypePasswordConfirmPassword}>The password should be the same password previously inserted</p>
            </Popover.Body>
        </Popover>)
    )

    const saveUser = async (e) => {
        e.preventDefault();
        const validName = currentUserName.length > 5 && /\d/.test(currentUserName);
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(currentEmail);
        const validPassword = currentPassword.length > 5 && /\d/.test(currentPassword) && currentPassword !== currentUserName;
        const validPasswordConfirm = currentPassword === currentPasswordConfirm;

        if (validName && validEmail && validPassword && validPasswordConfirm) {
            await axios.post('http://162.19.66.62:3001/register',
                {
                    userName: currentUserName,
                    email: currentEmail,
                    password: currentPassword,
                    confirmPassword: currentPasswordConfirm
                }
            ).then((res) => {
                if (res.data.status === 'OK') {
                    setRegisterSucceded(true);
                } else {
                    setRegistrationError(true);
                }
            })
        }

        else {
            setRegistrationError(true)
        }
    }


    return (
        <div className="col-md-3 mx-auto">
            {registerSucceded ? <RegisterSucceded /> :
                <Form> {registrationError ? <Alert variant="danger">Password or username not correct</Alert> : null}
                    <Form.Group className="mb-3" controlId="xxx">
                        <Form.Label>Username</Form.Label>
                        <OverlayTrigger trigger="focus" placement="right" overlay={popOverUserName}>
                            <Form.Control type="text" placeholder="Enter Username" onChange={(e) => {
                                setCurrentUserName(e.target.value);
                                setRegistrationError(false);
                            }} />
                        </OverlayTrigger>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <OverlayTrigger trigger="focus" placement="right" overlay={popOverEmail}>
                            <Form.Control type="email" placeholder="Enter Email" onChange={(e) => {
                                setRegistrationError(false);
                                setCurrentEmail(e.target.value);
                            }
                            } />
                        </OverlayTrigger>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <OverlayTrigger trigger="focus" placement="right" overlay={popOverPassword}>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                setRegistrationError(false);
                            }} />
                        </OverlayTrigger>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                        <Form.Label>Password Confirm</Form.Label>
                        <OverlayTrigger trigger="focus" placement="right" overlay={popOverPasswordConfirm}>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => {
                                setCurrentPasswordConfirm(e.target.value);
                                setRegistrationError(false);
                            }
                            } />
                        </OverlayTrigger>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={saveUser}>
                        Submit
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                </Form>}
        </div>);
}

export default Register;