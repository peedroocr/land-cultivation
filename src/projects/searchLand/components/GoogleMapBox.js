import { useJsApiLoader, GoogleMap } from '@react-google-maps/api'
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectAllMarkers, fetchMarkers } from '../features/markers/markersSlice';
import MarkerComponents from './MarkerComponent';

const GoogleMapBox = ({ token, userId }) => {

    const dispatch = useDispatch();
    const allMarkers = useSelector(selectAllMarkers);

    useEffect(() => {
        dispatch(fetchMarkers());
    }, [])

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBqPaPY4ARBXNKY2b2ezTcFRT317K8E9lU'
    })

    return (<div>
        {isLoaded ?
            <div style={{ width: '1000px', height: '500px' }}>
                <GoogleMap
                    center={{ lat: 40.416775, lng: -3.703790 }}
                    zoom={10}
                    mapContainerStyle={{ width: '100%', height: '100%' }}>
                    {allMarkers.map((marker, index) => {
                        return (<MarkerComponents token={token} userId={userId} key={marker.id} marker={marker} />)
                    })}
                </GoogleMap>
            </div> : null
        }
    </div >
    )
}


export default GoogleMapBox

