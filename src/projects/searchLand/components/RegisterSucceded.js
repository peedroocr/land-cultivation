import { useNavigate } from 'react-router-dom';

const RegisterSucceded = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Register Succeded!</h1>
            <h6 className="cursorPointer linkColor" onClick={() => navigate('/')}>Back to Home</h6>
        </div>)
}

export default RegisterSucceded