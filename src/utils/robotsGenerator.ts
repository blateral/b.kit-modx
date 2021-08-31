// const getApi = await Prismic.getApi(apiEndpoint, { req });

import { ServerResponse } from 'http';

export async function generateRobotsTxt({
    req,
    res,
}: {
    req: any;
    res?: ServerResponse;
}) {
    //FIXME:
    if (res) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.write({
            error: `Settingspage of Repository '${process.env.NEXT_PUBLIC_API_ENDPOINT}' was not found. Not creating robots.txtx`,
            code: 500,
        });
        return res.end();
    }

    // if (res && settings) {
    //     const robotsText = createRobotsText(settings);
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.write(robotsText);
    //     res.end();
    // }
}

// FIXME:
function createRobotsText(settings: any) {
    const settingsRobots = (settings as any).data.robots || '';

    if (settingsRobots) return settingsRobots;

    return settingsRobots;
}
createRobotsText;
