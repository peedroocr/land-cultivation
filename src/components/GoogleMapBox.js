import { useJsApiLoader, GoogleMap } from '@react-google-maps/api'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectAllMarkers, fetchMarkers } from '../features/markers/markersSlice';
import MarkerComponents from './MarkerComponent';
import { API_KEY } from '../config/config';

const GoogleMapBox = ({ token, userId }) => {

    const dispatch = useDispatch();
    const allMarkers = useSelector(selectAllMarkers);
    const [center, setCenter] = useState({ lat: 40.416775, lng: -3.703790 })
    useEffect(() => {
        dispatch(fetchMarkers());
    }, [])

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY
    })

    return (<div>
        {isLoaded ?
            <div style={{ width: '1000px', height: '500px' }}>
                <GoogleMap
                    center={center}
                    zoom={10}
                    mapContainerStyle={{ width: '100%', height: '100%' }}>
                    {allMarkers.map((marker, index) => {
                        return (<MarkerComponents token={token} userId={userId} key={marker.id} marker={marker} setCenter={setCenter} />)
                    })}
                </GoogleMap>
            </div> : null
        }
    </div >
    )
}


export default GoogleMapBox

