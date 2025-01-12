const geoEncoderApi = '3be1fd32756a4b6e8e2f3a4beb226d32';

async function getLatLng(locationString) {
    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationString)}&key=${geoEncoderApi}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0];
            const coords = {
                lat: location.geometry.lat,
                lng: location.geometry.lng
            };
            console.log(`Coordinates for ${locationString}:`, coords);
            return coords;
        } else {
            console.log("No results found for:", locationString);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data from OpenCage:', error);
        throw error;
    }
}


module.exports = getLatLng
