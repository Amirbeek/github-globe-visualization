import Map from './files/map.json';

function simulateFlightData(flightsData, Globe) {

    function getLatLng(city) {
        const cityData = Map.maps.find((map) => map.city === city);
        if (!cityData) {
            return null;
        }
        if (!cityData || isNaN(cityData.lat) || isNaN(cityData.lng)) {
            console.error(`Invalid city data for ${city}`);
            return null;
        }
        return {
            lat: parseFloat(cityData.lat),
            lng: parseFloat(cityData.lng),
        };
    }

    function simulateStep() {
        const numFlightsToShow = Math.floor(Math.random() * 3) + 1;
        const flightsToShow = [...flightsData].splice(0, numFlightsToShow);  // Copy and slice to avoid modifying original array

        if (flightsToShow.length === 0) {
            return;
        }

        const pulls = flightsToShow
            .map((flight, idx) => {
                const departureCityData = getLatLng(flight["Departure City"]);
                const arrivalCityData = getLatLng(flight["Arrival City"]);

                if (!departureCityData || !arrivalCityData) {
                    return null;
                }

                return {
                    type: "pull",
                    order: idx + 1,
                    from: flight["Departure City"],
                    to: flight["Arrival City"],
                    startLat: departureCityData.lat.toString(),
                    startLng: departureCityData.lng.toString(),
                    endLat: arrivalCityData.lat.toString(),
                    endLng: arrivalCityData.lng.toString(),
                    arcAlt: 0.5,
                };
            })
            .filter(Boolean);


        const updatedArcs = [...Globe.arcsData(), ...pulls];
        Globe.arcsData(updatedArcs);


        setTimeout(() => {
            const remainingArcs = Globe.arcsData().filter((arc) => !pulls.includes(arc));
            Globe.arcsData(remainingArcs);
        }, 5000);

        setTimeout(simulateStep, 3000);
    }

    setTimeout(() => {
        simulateStep();
    }, 1000);
}

export default simulateFlightData;
