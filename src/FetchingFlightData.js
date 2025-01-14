import Map from './files/map.json';

function simulateFlightData(flightsData, Globe) {
    function getLatLng(city) {
        const cityData = Map.maps.find((map) => map.city === city);
        if (!cityData) {
            console.error("City data not found for:", city);
            return null;
        }
        return { lat: parseFloat(cityData.lat), lng: parseFloat(cityData.lng) };
    }

    function simulateStep() {
        const indices = new Set();
        while (indices.size < Math.min(3, flightsData.length)) {
            const randomIndex = Math.floor(Math.random() * flightsData.length);
            indices.add(randomIndex);
        }

        const flightsToShow = Array.from(indices).map(index => flightsData[index]);

        if (flightsToShow.length === 0) {
            console.log("No flights to show.");
            return;
        }

        const pulls = flightsToShow.map((flight, idx) => {
            const departureCityData = getLatLng(flight["Departure City"]);
            const arrivalCityData = getLatLng(flight["Arrival City"]);

            if (!departureCityData || !arrivalCityData) {
                return null;
            }

            const isHighlighted = Math.random() < 1 / 3;
            return {
                type: "pull",
                order: idx + 1,
                from: flight["Departure City"],
                to: flight["Arrival City"],
                startLat: departureCityData.lat,
                startLng: departureCityData.lng,
                endLat: arrivalCityData.lat,
                endLng: arrivalCityData.lng,
                arcAlt: 0.5,
                status:  isHighlighted ? true : false
            };
        }).filter(Boolean);

        Globe.arcsData([...Globe.arcsData(), ...pulls]);
        setTimeout(() => {
            Globe.arcsData(Globe.arcsData().filter(arc => !pulls.includes(arc)));
        }, 5000);

        setTimeout(simulateStep, 4000);
    }

    setTimeout(simulateStep, 2000);
}

export default simulateFlightData;
