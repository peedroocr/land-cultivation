import { useJsApiLoader, GoogleMap, Marker, Polygon } from '@react-google-maps/api'
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const AddNewLand = ({ token }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBqPaPY4ARBXNKY2b2ezTcFRT317K8E9lU'
    });

    const [newMarker, setNewMarkers] = useState([]);
    const [marketEdit, setMarketEdit] = useState()
    const [showPolygon, setShowPolygon] = useState(false);
    const [polygonComplete, setPolygonComplete] = useState(false)
    const [openMarker, setOpenMarker] = useState(false)
    const [nameLand, setNameLand] = useState('');
    const [typeLand, setTypeLand] = useState('');
    const [hectaresLand, setHectaresLand] = useState('');
    const [priceLand, setPriceLand] = useState('');
    const [numberLand, setNumberLand] = useState('');
    const [emailtLand, setEmailLand] = useState('');
    const [centerMap, setCenterMap] = useState({ lat: 40.416775, lng: -3.703790 });

    const saveLand = async (e) => {
        e.preventDefault();

        //CONTORL NUMBER

        if (nameLand && typeLand && !isNaN(hectaresLand) && !isNaN(priceLand) && numberLand) {

            await axios.post('http://162.19.66.62:3001/saveLand',
                {
                    nameLand: nameLand,
                    typeLand: typeLand,
                    hectaresLand: hectaresLand,
                    priceLand: priceLand,
                    numberLand: numberLand,
                    emailtLand: emailtLand,
                    newMarkerlat: newMarker[0].lat,
                    newMarkerLng: newMarker[0].lng,
                    token: token,
                    allMarkers: newMarker
                }
            ).then((res) => {
                if (res.data.status === 'OK') {
                    setOpenMarker(false);
                    setPolygonComplete(false)
                    setNewMarkers([]);
                    setNameLand('');
                    setTypeLand('');
                    setHectaresLand('');
                    setPriceLand('');
                    setNumberLand('');
                    setEmailLand('');
                }

                /*             if (res.data.status === 'OK') {
                                const token = res.data.token;
                                setUserLogin(true);
                                setToken(token);
                                setErrorPassword(false);
                                localStorage.setItem('token', JSON.stringify({ token: token, userId: res.data.user }))
                            } else {
                                setErrorPassword(true);
                            }*/
            }
            );
        } else {
            console.log('errores en los datos')
        }

    }

    const drawPolygon = (e) => {
        setCenterMap(newMarker[0])
        if (!polygonComplete) {
            const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            let validator = false;
            newMarker.map((marker) => {
                return marker.lat === latLng.lat && marker.lng === latLng.lng ? validator = true : validator = false;
            })
            validator ? closeMarkers() : setNewMarkers(current => [...current, { lat: e.latLng.lat(), lng: e.latLng.lng() }])
            setShowPolygon(true)
        }
    }

    const closeMarkers = (e) => {
        console.log(newMarker.filter(position => position.lat === e.latLng.lat() && position.lng === e.latLng.lng()))
    }

    const editPolygon = (e) => {
        if (!polygonComplete) setMarketEdit({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    }
    const confirmEditPolyongc = (e) => {
        if (!polygonComplete) {
            const editNewMarkers = newMarker.map((markers, index) => {
                return markers.lat === marketEdit.lat && markers.lng === marketEdit.lng ? { lat: e.latLng.lat(), lng: e.latLng.lng() } : markers;
            })
            setNewMarkers(editNewMarkers);
        }
    }

    const closePolygon = (e) => {
        if (newMarker.length > 2) {
            setPolygonComplete(true)
            setOpenMarker(true)
        }
    }

    const cancelPolygon = () => {
        setOpenMarker(false);
        setPolygonComplete(false)
        setNewMarkers([]);
        setNameLand('');
        setTypeLand('');
        setHectaresLand('');
        setPriceLand('');
        setNumberLand('');
        setEmailLand('');
    }

    return (<div>
        {isLoaded ? <div style={{ width: '1000px', height: '500px' }} >
            <GoogleMap
                center={centerMap}
                zoom={10}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onClick={drawPolygon}
            >
                {polygonComplete ?
                    <Marker position={newMarker[0]} >
                    </Marker> : null
                }
                {showPolygon ?
                    <>
                        <Polygon
                            path={newMarker}
                            editable={!polygonComplete}
                            onMouseDown={editPolygon}
                            onMouseUp={confirmEditPolyongc} />
                    </>
                    : null}
            </GoogleMap>
            <Button variant="primary" onClick={closePolygon}>
                Añadir Información
            </Button>
            <Button variant="secondary" onClick={cancelPolygon}>
                Cancelar
            </Button>


            {openMarker &&
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="Nombre del campo" onChange={(e) => setNameLand(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo:</Form.Label>
                        <Form.Control type="text" placeholder="Tipo de campo" onChange={(e) => setTypeLand(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hectáreas</Form.Label>
                        <Form.Control type="text" placeholder="Hectáreas" onChange={(e) => setHectaresLand(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control type="text" placeholder="Precio €" onChange={(e) => setPriceLand(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Conctacto</Form.Label>
                        <Form.Control type="text" placeholder="Number" onChange={(e) => setNumberLand(e.target.value)} />
                        <Form.Control type="email" placeholder="Email" onChange={(e) => setEmailLand(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" onClick={saveLand}>
                        Submit
                    </Button>
                </Form >
            }
        </div > : null
        }
    </div >)



}

export default AddNewLand;