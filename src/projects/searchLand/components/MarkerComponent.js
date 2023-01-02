import { useState } from "react";
import { Marker, InfoWindow, Polygon } from '@react-google-maps/api'
import { useDispatch } from 'react-redux';
import { markerShow } from '../features/markers/markersSlice';
import FieldInformation from './FieldInformation';

const MarkerComponents = ({ marker, token, userId }) => {
    const dispatch = useDispatch();
    const [onClickShow, setOnclickShow] = useState(false);

    return <>
        <Marker position={marker.marker} onClick={(e) => {
            dispatch(markerShow({ id: marker.id }));
            setOnclickShow(true);
        }}>
            {marker.show && onClickShow &&
                <InfoWindow  >
                    <FieldInformation userId={userId} token={token} marker={marker} />
                </InfoWindow>}

        </Marker>
        {marker.show ? <Polygon path={marker.path} /> : null}
    </>
}

export default MarkerComponents;