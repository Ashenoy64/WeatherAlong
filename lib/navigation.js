import axios from 'axios';




SOURCE = [12.925276, 77.675773]
DESTINATION = [12.932353, 77.544916]



async function getDirections(source, destination) {
    const route = '/routing/v1/directions'

    const combinedSource = `${source[0]}%2C${source[1]}`
    const combinedDestination = `${destination[0]}%2C${destination[1]}`

    const url = `${process.env.OLA_BASE_URL}${route}?source=${combinedSource}&destination=${combinedDestination}&key=${process.env.API_KEY}`

    waypoints = []
    try {
        const response = await axios.post(url)
        const routes = response.data.routes
        if (routes && routes > 0) {
            for (let route of routes) {
                const steps = route.legs.steps
                waypoint = []
                for (let step of steps) {
                    waypoint.push({
                        source: [step.start_location.lat, step.start_location.lng],
                        destination: [step.end_location.lat, step.end_location.lng],
                        duration: step.duration,
                        distance: step.distance,
                    })
                }
                waypoints.push(waypoint)
            }
        }
    }
    catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
    finally {
        return waypoints
    }

}


async function getPlaceName(source) {
    const route = '/places/v1/nearbysearch'
    const combinedSource = `${source[0]}%2C${source[1]}`
    const url = `${process.env.OLA_BASE_URL}${route}?location=${combinedSource}&key=${process.env.API_KEY}`
    try {
        const response = await axios.get(url)
        if (response.data && response.data.predictions && response.data.predictions.length > 0) {
            const place = response.data.predictions[0]
            terms = []
            for (let term of place.terms) {
                if (term.offset > 100) {
                    break;
                }
                else if (term.offset > 50 && term.offset < 100 && term.value !='[no Name]') {
                    terms.push({
                        value: term.value,
                        offset: term.offset,
                        
                    })
                }
            }
            return {
                placeId: place.place_id,
                terms: terms,
                placeName: place.structured_formatting.main_text,
                address: place.structured_formatting.secondary_text,
                location: source,
            }
        }
    }
    catch (error) {
        console.error('Error fetching place name:', error);
        throw error;
    }
    finally {
        return null
    }
}



export {
    getDirections,
    getPlaceName,
}
