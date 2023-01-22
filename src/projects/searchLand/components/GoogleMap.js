import { useJsApiLoader, GoogleMap } from '@react-google-maps/api'

const GoogleMapBox = () => {
    console.log(API_KEY)


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY
    })
    return (<div>
        {isLoaded ? 'AAAAAA' : null}
    </div>
    )
}


export default GoogleMapBox