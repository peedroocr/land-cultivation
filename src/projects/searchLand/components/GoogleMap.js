import { useJsApiLoader, GoogleMap } from '@react-google-maps/api'

import { useRef, useEffect } from "react";

//AIzaSyBqPaPY4ARBXNKY2b2ezTcFRT317K8E9lU

const GoogleMapBox = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDxeGjXqTECyi2e3ezrYN0nQSd9fXOqxgY'
    })
    return (<div>
        {isLoaded ? 'AAAAAA' : null}
    </div>
    )
}


export default GoogleMapBox