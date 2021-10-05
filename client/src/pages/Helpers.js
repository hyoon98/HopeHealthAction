export const getGPSLocation = (setState) => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((data) => {
            setState({lat: data.coords.latitude, lng: data.coords.longitude});
         }, (err) => console.log(err), {enableHighAccuracy:false, timeout: 4000, maximumAge: Infinity})
        
    }else{
        console.log('Browser does not support geolocation');
    }
};
