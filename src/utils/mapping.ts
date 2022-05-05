export const isSVG = (url?: string) => {
    return url ? /\.(svg)$/i.test(url) : false;
};


export const normalizeAnchorId = (anchorId?: string) => {
    return anchorId?.replace(/\s/g, '_').toLowerCase() || '';
};


export const parseLinkListFromHtml = (htmlString: string) => {
    const paragraphs = Array.from(htmlString.matchAll(/(<p>)(.*?)(<\/p>)/gis));
    const splittedParagraphs = paragraphs.map((item) => item[0]);

    const classifiedParagraphs = splittedParagraphs.map((paragraph) => {
        const trimmedParagraph = paragraph.trim().substring(3, 6);
        if (trimmedParagraph.includes('<a')) {
            const pair = Array.from(paragraph);
            pair.splice(2, 0, ' class="linklist"');
            return pair.join('');
        } else {
            return paragraph;
        }
    });

    return classifiedParagraphs.join('');
};
