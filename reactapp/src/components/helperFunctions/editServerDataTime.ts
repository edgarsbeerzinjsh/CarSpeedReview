import moment from "moment";

export const onlyDateFromJsonDateTimeList = (dateTimes: string[]) => {
    return (
        dateTimes.map((date) => {
            return moment(date).format("YYYY-MM-DD");
        })
    );
};

export const editTimeOfRecord = (returnData: any) => {
    return (
        returnData.map((item: any) => {
            const toIsoDate = moment(item.timeOfRecord);
            return {
                ...item,
                timeOfRecord: toIsoDate.format("YYYY-MM-DD HH:mm:ss"),
            };
        }));
}