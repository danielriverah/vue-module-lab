// /utils/geo.js
export function distMeters(a, b) {
    const R = 6371000
    const toRad = x => x * Math.PI / 180
    const x = toRad(b.lng - a.lng) * Math.cos(toRad((a.lat + b.lat) / 2))
    const y = toRad(b.lat - a.lat)
    return Math.sqrt(x*x + y*y) * R
}
  
export function angleDeg(A, B, C) {
    const v1 = { x: A.lng - B.lng, y: A.lat - B.lat }
    const v2 = { x: C.lng - B.lng, y: C.lat - B.lat }
  
    const dot = v1.x*v2.x + v1.y*v2.y
    const m1 = Math.hypot(v1.x, v1.y)
    const m2 = Math.hypot(v2.x, v2.y)
    if (!m1 || !m2) return 0
  
    const cos = Math.max(-1, Math.min(1, dot/(m1*m2)))
    return Math.acos(cos) * 180 / Math.PI
}
