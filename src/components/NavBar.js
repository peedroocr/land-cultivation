import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";


const NavBar = ({ token, userLogin, setToken, setUserLogin }) => {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand className="cursorPointer" onClick={() => navigate("/")}>Navbar scroll</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                        {//token && userLogin ? <Nav.Link onClick={() => navigate('/Map')}>Map</Nav.Link> : null}
                        }{token && userLogin ? null : < Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>}
                        {token && userLogin ? null : <Nav.Link onClick={() => navigate('/register')}>Register</Nav.Link>}
                        {token && userLogin ? <Nav.Link onClick={() => navigate('/NewLand')}>New Land</Nav.Link> : null}
                    </Nav>
                    <Form className="d-flex">
                        {token || userLogin ?
                            <Nav.Link onClick={() => {
                                navigate('/');
                                localStorage.removeItem('token');
                                setToken('');
                                setUserLogin('');

                            }}>LogOut</Nav.Link> : null}

                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}



export default NavBar;