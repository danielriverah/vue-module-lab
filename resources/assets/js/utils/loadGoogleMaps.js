let googleMapsPromise=null

export function loadGoogleMaps(apiKey) {
    if (window.google && window.google.maps) {
        return Promise.resolve(window.google)
    }
    if (googleMapsPromise) return googleMapsPromise
    googleMapsPromise = new Promise((resolve,reject) => {
        window.__initGoogleMaps = () => {
            console.log(window.google)
            resolve(window.google)
            delete window.__initGoogleMaps
        }
        // if (window.google && window.google.maps) {
        // resolve(window.google)
        // return
        // }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=geometry,places&loading=async&callback=__initGoogleMaps`
        script.async = true
        script.defer = true
        script.onerror = reject
        //script.onload = () => resolve(window.google)

        document.head.appendChild(script)
    })

    return googleMapsPromise
}