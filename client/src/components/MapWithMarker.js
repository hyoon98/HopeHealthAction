import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

function MapWithMarker(props) {

    const { loadingElement, containerElement, mapElement, location } = props;

    // Reference: https://tomchentw.github.io/react-google-maps/#usage--configuration
    // Usage of this component also retrieved from reference
    const MapWithMarker = withScriptjs(withGoogleMap((props) => {

        let { location } = props;
    
        return (
            <GoogleMap
                defaultZoom={11}
                defaultCenter={location}
            >
                <Marker position={location}/>
            </GoogleMap>
        )
    }))

    return (
        <MapWithMarker
            // Will need to enter API key to remove the "For development purposes only" watermark
            googleMapURL={(typeof process.env.REACT_APP_GOOGLE_MAPS_API_KEY === 'undefined') ? (
                "https://maps.googleapis.com/maps/api/js?key=&v=3.exp&libraries=geometry,drawing,places"
            ): (
                "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_MAPS_API_KEY + "&v=3.exp&libraries=geometry,drawing,places"
            )}
            loadingElement={loadingElement}
            containerElement={containerElement}
            mapElement={mapElement}
            location={location}
        />
    )
}

export default MapWithMarker;
