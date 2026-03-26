// utils/rdp.js

import { distMeters } from './geo'

/**
 * Distancia perpendicular de punto P a la línea AB (en metros)
 */
function perpendicularDistance(P, A, B) {
    // Convertimos a un plano local aproximado
    // Usamos distancia en metros basada en proyección simple

    const area = Math.abs(
        (A.lng * (B.lat - P.lat)) +
        (B.lng * (P.lat - A.lat)) +
        (P.lng * (A.lat - B.lat))
    )

    const base = Math.sqrt(
        Math.pow(B.lat - A.lat, 2) +
        Math.pow(B.lng - A.lng, 2)
    )

    if (base === 0) return distMeters(P, A)

    // Esto devuelve distancia en grados.
    // Convertimos a metros aproximados usando distMeters
    const distAB = distMeters(A, B)
    if (distAB === 0) return 0

    // proporción del área en relación al segmento
    const heightRatio = (area / 2) / base

    // Escalamos usando longitud real en metros
    return Math.abs(heightRatio) * (distAB / base)
}

/**
 * Algoritmo RDP recursivo
 */
function rdpRecursive(points, epsilon) {
    if (points.length < 3) return points

    let maxDistance = 0
    let index = 0

    const start = points[0]
    const end = points[points.length - 1]

    for (let i = 1; i < points.length - 1; i++) {
        const dist = perpendicularDistance(points[i], start, end)

        if (dist > maxDistance) {
        index = i
        maxDistance = dist
        }
    }

    if (maxDistance > epsilon) {
        const left = rdpRecursive(points.slice(0, index + 1), epsilon)
        const right = rdpRecursive(points.slice(index), epsilon)

        return [...left.slice(0, -1), ...right]
    } else {
        return [start, end]
    }
    }

    /**
     * Función principal
     * @param {Array} points [{lat,lng}]
     * @param {Number} epsilon tolerancia en metros
     * @param {Boolean} isClosed si es polígono cerrado
     */
export function rdpSimplify(points, epsilon = 1, isClosed = false) {
    if (!points || points.length < 3) return points

    let pts = [...points]

    // Si es polígono cerrado, quitamos el último duplicado
    if (isClosed) {
        const first = pts[0]
        const last = pts[pts.length - 1]
        if (first.lat === last.lat && first.lng === last.lng) {
        pts.pop()
        }
    }

    const simplified = rdpRecursive(pts, epsilon)

    if (isClosed && simplified.length > 2) {
        simplified.push({ ...simplified[0] })
    }

    return simplified
}