export const parseModxDateToObject = (datestring: string) => {
    try {
        const dateparts = datestring.split(' ');

        const date = dateparts?.[0]?.split('-');
        const time = dateparts?.[1]?.split(':');

        const dateObject = new Date(
            +date[0],
            +date[1],
            +date[2],
            +time[0],
            +time[1],
            +time[2]
        );
        return dateObject;
    } catch (e) {
        console.error('Error parsing date for structured data: ', e);
        return new Date();
    }
};
