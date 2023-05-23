import { editTimeOfRecord } from "../components/helperFunctions/editServerDataTime";
import { lineToRoadEntry, stringToArray } from "../components/helperFunctions/uploadContentToRoadEntriesList";
import { addHoursWithZeroEntries } from "../components/validations/dayDataHasEachHour";
import { incompleteOneDayData } from "../mockData/listOfOneDayRoadEntries";

describe("Component help functions", () => {

    it("Validation of day: should add missing hours and sort ascending", () => {
        const expectedArray = Array.from({ length: 24 }, (_, index) => index);

        const dayData = addHoursWithZeroEntries([...incompleteOneDayData]);

        for (let i=0; i<dayData.length; i++){
            expect(dayData[i].hour).toEqual(expectedArray[i]);
        }
    });

    it("Edit time of record should change only date format to `YYYY-MM-DD HH:mm:ss`", () => {
        const testRoadEntries = [
            {id: 1, timeOfRecord: "2020-08-01T00:01:00" ,speed: 50, carRegistrationNumber: "SP8224"},
            {id: 2, timeOfRecord: "2020-08-02T01:00:00" ,speed: 51, carRegistrationNumber: "SP8225"},
            {id: 3, timeOfRecord: "2020-09-01T00:00:30" ,speed: 52, carRegistrationNumber: "SP8226"},
        ]

        const data = editTimeOfRecord([...testRoadEntries]);

        expect(data[0].timeOfRecord).toEqual("2020-08-01 00:01:00");
        expect(data[1].timeOfRecord).toEqual("2020-08-02 01:00:00");
        expect(data[2].timeOfRecord).toEqual("2020-09-01 00:00:30");

        for (let i=0; i<testRoadEntries.length; i++){
            expect(data[i].speed).toEqual(testRoadEntries[i].speed);
            expect(data[i].carRegistrationNumber).toEqual(testRoadEntries[i].carRegistrationNumber);
            expect(data[i].id).toEqual(testRoadEntries[i].id);
        }
    });

    it("String should be splitted by tabs and returned object", () => {
        const textLine = "2022-12-01\t35\tLV1001"

        const entryData = lineToRoadEntry(textLine);

        expect(entryData.timeOfRecord).toEqual("2022-12-01T00:00:00.000Z");
        expect(entryData.speed).toEqual(35);
        expect(entryData.carRegistrationNumber).toEqual("LV1001");
    });

    it("Multiple line string should be splitted to lines", () => {
        const multipleLineText = "Multiple line\n string should be\n splitted to lines";

        const splittedText = stringToArray(multipleLineText);

        expect(splittedText).toHaveLength(3);
    });
});