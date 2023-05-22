import { DayHourSpeed } from "../types/DayHourSpeeds";

export const addHoursWithZeroEntries = (fullDayData: DayHourSpeed[]) => {
    return (
        Array.from(Array(24).keys())
            .map((h) => {
                const eachHour = fullDayData.find((e) => e.hour === h);
                if (eachHour) {
                    return { hour: h, averageSpeed: eachHour.averageSpeed };
                }
                   return { hour: h, averageSpeed: 0 };
            }
        ).sort((a, b) => a.hour - b.hour)
    );
}