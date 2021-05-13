export function parseUrl() {
    return (window.location.href
        .split('?')[1] || '')
        .split('&')
        .map(element => element.split('='))
        .reduce((acc, [key, value]) => {

            acc[key] = value;
            return acc;
        }, {});
}
