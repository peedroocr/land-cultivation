import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios';
import { updateMarker } from '../features/markers/markersSlice';

const FieldInformation = ({ marker, token, userId }) => {

    console.log('aaaaaaaaa')
    const [editCard, setEditCard] = useState(false);
    const [nameLand, setNameLand] = useState(marker.information.name);
    const [typeLand, setTypeLand] = useState(marker.information.type);
    const [hectaresLand, setHectaresLand] = useState(marker.information.hectares);
    const [priceLand, setPriceLand] = useState(marker.information.price);
    const [numberLand, setNumberLand] = useState(marker.information.number);
    const [emailtLand, setEmailLand] = useState(marker.information.email);

    const saveChanges = async () => {
        e.preventDefault();
        await axios.post('http://162.19.66.62:3001/updateLand',
            {
                markerId: marker.id,
                nameLand: nameLand,
                typeLand: typeLand,
                hectaresLand: hectaresLand,
                priceLand: priceLand,
                numberLand: numberLand,
                emailtLand: emailtLand
            }
        ).then((res) => {

            console.log(res);
            if (res.data.status === 'OK') {
                setEditCard(false);

                dispatch(updateMarker({
                    markerId: marker.id,
                    nameLand: nameLand,
                    typeLand: typeLand,
                    hectaresLand: hectaresLand,
                    priceLand: priceLand,
                    numberLand: numberLand,
                    emailtLand: emailtLand
                }));
            }
        }
        );




    }

    return <div >
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                {editCard ? <Card.Title><input type="text" value={nameLand} onChange={(e) => setNameLand(e.target.value)} /> </Card.Title> : <Card.Title>Terrenos {marker.information.name} </Card.Title>}
                <Card.Subtitle className="mb-2 text-muted">Información del terreno</Card.Subtitle>
                <Card.Text>
                    {!editCard &&
                        <>
                            <label>
                                Tipo: {marker.information.type}
                            </label>
                            <br />
                            <label>
                                Hectareas: {marker.information.hectares}
                            </label>
                            <br />
                            <label>
                                Precio: {marker.information.price}
                            </label>
                            <br />
                            <label>
                                Telefono: {marker.information.number}
                            </label>
                            <br />
                            <label>
                                Email: {marker.information.email}
                            </label>
                        </>
                    }
                    {editCard &&
                        <>
                            <label>
                                Tipo:
                            </label><input type="text" value={typeLand} onChange={(e) => setTypeLand(e.target.value)} />
                            <br />
                            <label>
                                Hectareas:
                            </label><input type="text" value={hectaresLand} onChange={(e) => setHectaresLand(e.target.value)} />
                            <br />
                            <label>
                                Precio:
                            </label><input type="text" value={priceLand} onChange={(e) => setPriceLand(e.target.value)} />
                            <br />
                            <label>
                                Telefono:
                            </label><input type="text" value={numberLand} onChange={(e) => setNumberLand(e.target.value)} />
                            <br />
                            <label>
                                Email:
                            </label><input type="text" value={emailtLand} onChange={(e) => setEmailLand(e.target.value)} />
                        </>
                    }
                </Card.Text>
                {token && userId === marker.userId ? (!editCard ? <Button variant="primary" onClick={() => setEditCard(true)}>Edit</Button> :
                    <>
                        <Button variant="primary" onClick={saveChanges}> Save</Button>
                        <Button variant="secondary" onClick={() => setEditCard(false)}> Cancel</Button>

                    </>) : null
                }
            </Card.Body>

        </Card>
    </div >


}

export default FieldInformation;

