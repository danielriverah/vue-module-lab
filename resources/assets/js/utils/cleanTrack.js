// /utils/cleanTrack.js
import { distMeters, angleDeg } from './geo'

export function removeNear(points, minDistMeters = 0.5) {
    if (points.length <= 2) return points.slice()
    const out = [points[0]]
    for (let i = 1; i < points.length; i++) {
        const prev = out[out.length - 1]
        if (distMeters(prev, points[i]) >= minDistMeters) out.push(points[i])
    }
    return out
}

export function removeCollinear(points, straightToleranceDeg = 5) {
    if (points.length < 3) return points.slice()
    const out = [points[0]]
    for (let i = 1; i < points.length - 1; i++) {
        const A = out[out.length - 1]
        const B = points[i]
        const C = points[i + 1]
        const ang = angleDeg(A, B, C)
        const almostStraight = ang >= (180 - straightToleranceDeg)
        if (!almostStraight) out.push(B)
    }
    out.push(points[points.length - 1])
    return out
}
export function sortClockwise(points) {
    const center = {
        lat: points.reduce((s,p)=>s+p.lat,0)/points.length,
        lng: points.reduce((s,p)=>s+p.lng,0)/points.length
    }
  
    return [...points].sort((a,b)=>{
        const angleA = Math.atan2(a.lat-center.lat, a.lng-center.lng)
        const angleB = Math.atan2(b.lat-center.lat, b.lng-center.lng)
        return angleA - angleB
    })
}
export function hasSelfIntersection(points) {
    function intersect(a,b,c,d){
        function ccw(p1,p2,p3){
            return (p3.lat-p1.lat)*(p2.lng-p1.lng) >
                (p2.lat-p1.lat)*(p3.lng-p1.lng)
        }
        return ccw(a,c,d) !== ccw(b,c,d) &&
                ccw(a,b,c) !== ccw(a,b,d)
    }
  
    for(let i=0;i<points.length-1;i++){
        for(let j=i+2;j<points.length-1;j++){
            if(intersect(points[i],points[i+1],points[j],points[j+1])){
            return true
            }
        }
    }
    return false
}