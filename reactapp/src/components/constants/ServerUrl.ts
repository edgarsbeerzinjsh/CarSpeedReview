const SERVER_URL = "http://localhost:5000";
const DATA = "CarSpeedData";
const VISUAL = "Visualization";

export const SERVER_LINKS = {
    UPLOAD : `${SERVER_URL}/${DATA}/upload`,
    ALL_DATA : `${SERVER_URL}/${DATA}`,
    FILTERED : `${SERVER_URL}/${DATA}/filtered`,
    AVAILABLE_DAYS : `${SERVER_URL}/${VISUAL}/possibleDays`,
    DAY_DATA : `${SERVER_URL}/${VISUAL}`,
    PING : `${SERVER_URL}/Ping`
}