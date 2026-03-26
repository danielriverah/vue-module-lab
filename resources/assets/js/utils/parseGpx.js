export function parseGpxToPoints(gpxText) {
    const parser = new DOMParser()
    const xml = parser.parseFromString(gpxText, 'text/xml')

    // si el XML está mal parseado
    const parserError = xml.getElementsByTagName('parsererror')
    if (parserError?.length) {
        throw new Error('GPX inválido (parsererror).')
    }

    const trkpts = xml.getElementsByTagName('trkpt')
    const points = []

    for (let i = 0; i < trkpts.length; i++) {
        const lat = parseFloat(trkpts[i].getAttribute('lat'))
        const lng = parseFloat(trkpts[i].getAttribute('lon'))
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
        points.push({ lat, lng })
    }

    return points
}