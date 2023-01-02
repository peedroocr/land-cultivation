import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
//import { io } from "socket.io-client";
import { Navigate } from "react-router-dom";
import axios from 'axios';

import NavBar from './components/NavBar';
import Register from './components/Register';
import GoogleMapBox from './components/GoogleMapBox';
import Login from './components/Login';
import Home from "./components/Home";
import AddNewLand from "./components/AddNewLand";
import ErrorPage from "./components/ErrorPage";


//const socket = io.connect("http://162.19.66.62:3001");

const SearchLand = () => {
    const [userLogin, setUserLogin] = useState(false);
    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');

    const getToken = async () => {
        const localStorageToken = JSON.parse(localStorage.getItem('token'))
        if (localStorageToken) {
            await axios.post('http://162.19.66.62:3001/userLoged', localStorageToken)
                .then((res) => {
                    if (res.data.status === 'OK') {
                        setUserId(res.data.userId)
                        setUserLogin(true);
                        setToken(localStorageToken.token);
                        setUserName(res.data.userName)
                    }
                })
        };
    }

    useEffect(() => {
        getToken();
    }, [])

    return (
        <><NavBar token={token} userLogin={userLogin} setUserLogin={setUserLogin} setToken={setToken} />
            <main className='container'>
                <Routes>
                    <Route path={'/searchLand/login'} exact element={userLogin && token ?
                        <Navigate to='/searchLand/' /> :
                        <Login
                            token={token}
                            setUserId={setUserId}
                            userLogin={userLogin}
                            setUserLogin={setUserLogin}
                            setToken={setToken} />} />

                    <Route path={'/searchLand/register'} exact element={!userLogin && !token ?
                        <Register /> : <Navigate to='/searchLand/' />} />
                    <Route path={'/searchLand/'} exact element={
                        <GoogleMapBox
                            token={token}
                            userId={userId} />}
                    />

                    <Route path={'/searchLand/NewLand'} exact element={userLogin && token ?
                        <AddNewLand
                            token={token}
                            userLogin={userLogin} /> :
                        <Navigate to='/searchLand/' />}
                    />

                    <Route path={'/searchLand/*'} exact element={
                        <ErrorPage
                            token={token}
                            userLogin={userLogin}
                            setUserLogin={setUserLogin}
                            setToken={setToken} />}
                    />

                </Routes>
            </main>
        </>
    );
}

export default SearchLand;
