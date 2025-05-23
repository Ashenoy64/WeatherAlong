function getAreaAlongTime(waypoints, time) {
    areas = []
    for(let waypoint of waypoints){
        let timeElapsed = 0
        let cummulativeDistance = 0
        let cummulativeTime =0
        let area = []
        for(let step of waypoint){
            timeElapsed += step.duration
            cummulativeDistance += step.distance
            cummulativeTime += step.duration
            if(timeElapsed >= time){
                area.push({
                    destination: step.destination,
                    duration: cummulativeTime,
                    distance: cummulativeDistance,
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
        let cummulativeDistance =0 
        let cummulativeTime =0
        let area = []
        for(let step of waypoint){
            distanceElapsed += step.distance
            cummulativeDistance += step.distance
            cummulativeTime += step.duration
            if(distanceElapsed >= distance){
                area.push({
                    destination: step.destination,
                    duration: cummulativeTime,
                    distance: cummulativeDistance,
                })
                distanceElapsed = 0
            }
        }
        areas.push(area)
    }
    return areas
}


function getAreaAndWeather( areas ) {
    const areaWeather = []
    for (const area of areas) {
        const weather = getWeatherByTime(area.destination, Date.now + area.duration)
        if (!weather) {
            continue
        }
        areaWeather.push({
            ...area,
            weather: weather
        })
    }
    return areaWeather
}

export {
    getAreaAlongTime,
    getAreaAlongDistance,
    getAreaAndWeather,
}