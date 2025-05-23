function getAreaAlongTime(waypoints, time) {
    areas = []
    for(let waypoint of waypoints){
        let timeElapsed = 0
        let area = []
        for(let step of waypoint){
            timeElapsed += step.duration
            if(timeElapsed >= time){
                area.push({
                    destination: step.destination,
                    duration: step.duration,
                    distance: step.distance,
                })
                timeElapsed = 0
            }
        }
        areas.push(area)
    }
    return areas
}

function getAreaAlongDistance(waypoints, distance) {
    areas = []
    for(let waypoint of waypoints){
        let distanceElapsed = 0
        let area = []
        for(let step of waypoint){
            distanceElapsed += step.distance
            if(distanceElapsed >= distance){
                area.push({
                    destination: step.destination,
                    duration: step.duration,
                    distance: step.distance,
                })
                distanceElapsed = 0
            }
        }
        areas.push(area)
    }
    return areas
}


export {
    getAreaAlongTime,
    getAreaAlongDistance,
}