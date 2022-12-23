export const getGoogleMapsURL = (searchParam: string) => {
    if (!searchParam) return undefined;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchParam
    )}`;
};
