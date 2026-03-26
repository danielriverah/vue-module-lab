export function route(name, params = {}) {
    const parts = name.split('.');
    let url = window.AppRoutes;
    // console.log(parts,url);

    for (let part of parts) {
        if (!url[part]) {
            console.error(`Ruta "${name}" no encontrada`);
            return '';
        }
        url = url[part];
    }

    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
}
