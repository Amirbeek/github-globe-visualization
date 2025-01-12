import Map from './files/map.json';

function simulateFlightData(flightsData, Globe) {
    console.log("--- Starting Flight Simulation ---");

    function getLatLng(city) {
        const cityData = Map.maps.find((map) => map.city === city);
        if (!cityData) {
            console.error(`City not found in map data: ${city}`);
            return null;
        }
        return {
            lat: parseFloat(cityData.lat),
            lng: parseFloat(cityData.lng),
        };
    }

    function simulateStep() {
        const numFlightsToShow = Math.floor(Math.random() * 3) + 1;
        const flightsToShow = flightsData.splice(0, numFlightsToShow);

        if (flightsToShow.length === 0) {
            console.log("--- Flight Simulation Complete ---");
            return;
        }

        const pulls = flightsToShow
            .map((flight, idx) => {
                const departureCityData = getLatLng(flight["Departure City"]);
                const arrivalCityData = getLatLng(flight["Arrival City"]);

                if (!departureCityData || !arrivalCityData) {
                    console.error("Missing city data for flight:", flight);
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

        // Log added arcs
        console.log("Adding arcs:", pulls);

        const updatedArcs = [...Globe.arcsData(), ...pulls];
        Globe.arcsData(updatedArcs);

        console.log("Updated Globe arcs:", Globe.arcsData());

        setTimeout(() => {
            const remainingArcs = Globe.arcsData().filter((arc) => !pulls.includes(arc));
            Globe.arcsData(remainingArcs);
            console.log("Removed arcs:", pulls);
            console.log("Remaining arcs:", remainingArcs);
        }, 5000);

        // Schedule the next step
        setTimeout(simulateStep, 3000);
    }

    // Delay the start of the flight simulation by 1 second after the page loads
    setTimeout(() => {
        simulateStep();
    }, 1000);
}

export default simulateFlightData;
