export const isSVG = (url?: string) => {
    return url ? /\.(svg)$/i.test(url) : false;
};


export const normalizeAnchorId = (anchorId?: string) => {
    return anchorId?.replace(/\s/g, '_').toLowerCase() || '';
};

