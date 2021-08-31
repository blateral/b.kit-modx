export const isSVG = (url?: string) => {
    return url ? /\.(svg)$/i.test(url) : false;
};
