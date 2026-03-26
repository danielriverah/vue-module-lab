function distMeters(a, b) {
    const R = 6371000
    const toRad = x => x * Math.PI / 180
  
    const x = toRad(b.lng - a.lng) * Math.cos(toRad((a.lat + b.lat)/2))
    const y = toRad(b.lat - a.lat)
  
    return Math.sqrt(x*x + y*y) * R
}
  
function angleDeg(A, B, C) {
    const v1 = { x: A.lng - B.lng, y: A.lat - B.lat }
    const v2 = { x: C.lng - B.lng, y: C.lat - B.lat }

    const dot = v1.x*v2.x + v1.y*v2.y
    const m1 = Math.hypot(v1.x, v1.y)
    const m2 = Math.hypot(v2.x, v2.y)

    if (!m1 || !m2) return 0

    const cos = Math.max(-1, Math.min(1, dot/(m1*m2)))
    return Math.acos(cos) * 180/Math.PI
}
export function cleanGpsTrack(points, config = {}) {
  
    const {
        minDistance = 0.5,
        straightTolerance = 5
    } = config
  
    let result = [points[0]]
  
    for (let i = 1; i < points.length - 1; i++) {
        const A = result[result.length - 1]
        const B = points[i]
        const C = points[i + 1]
    
        if (distMeters(A, B) < minDistance) continue
    
        const ang = angleDeg(A, B, C)
    
        if (ang > (180 - straightTolerance)) continue
    
        result.push(B)
    }
    result.push(points[points.length - 1])
    return result
}