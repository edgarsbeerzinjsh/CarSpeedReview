import moment from "moment";

export const stringToArray = (content: string) => {
    return (content?.split(/\r\n|\r|\n/));
};

export const lineToRoadEntry = (line: string) => {
	const parameters = line.split(/\t/);
	const oneEntry = {
		timeOfRecord: moment
			.utc(parameters[0], "YYYY-MM-DD HH:mm:ss")
			.toISOString(),
		speed: +parameters[1],
		carRegistrationNumber: parameters[2],
	};

	return oneEntry;
};
