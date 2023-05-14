import moment from "moment";

export const stringToRoadEntryArray = (content: string) => {
    const entryArray = content?.split(/\r\n|\r|\n/).map((entry) => {
        return lineToRoadEntry(entry);
    });

    return entryArray;
}

const lineToRoadEntry = (line: string) => {
    const parameters = line.split(/\t/);
    const oneEntry = {
        timeOfRecord: moment.utc(parameters[0], "YYYY-MM-DD HH:mm:ss").toISOString(),
        speed: +parameters[1],
        carRegistration: parameters[2],
    };

    return oneEntry;
};