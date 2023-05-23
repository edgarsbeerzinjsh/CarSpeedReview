import { useEffect, useState } from "react";
import { SERVER_LINKS } from "../components/constants/ServerUrl";
import { Line } from "react-chartjs-2";
import { DayHourSpeed } from "../components/types/DayHourSpeed";
import { Chart, ChartOptions, registerables } from "chart.js";
import { ping } from "../components/helperFunctions/ping";
import { onlyDateFromJsonDateTimeList } from "../components/helperFunctions/editServerDataTime";
import { addHoursWithZeroEntries } from "../components/validations/dayDataHasEachHour";
Chart.register(...registerables);

export const Graphics = () => {
	const [dateOptions, setDateOptions] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [dayData, setDayData] = useState<DayHourSpeed[]>([]);
	const [APIon, setAPIon] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const apiState = ping();
		apiState.then((result) => setAPIon(result));
		setIsLoading(true);

		const fetchData = async () => {
			try {
				const data = await fetch(SERVER_LINKS.AVAILABLE_DAYS, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const recivedData: string[] = await data.json();
				setDateOptions(onlyDateFromJsonDateTimeList(recivedData));
				updateGraph(recivedData[0]);
			} catch (error) {
				console.log("error", error);
			}
		};

		fetchData();
	}, []);

	const updateGraph = (date: string) => {
		const fetchDayData = async () => {
			try {
				const data = await fetch(`${SERVER_LINKS.DAY_DATA}?date=${date}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const recivedData: DayHourSpeed[] = await data.json();
				setDayData(addHoursWithZeroEntries(recivedData));
			} catch (error) {
				console.log("error", error);
			}
		};

		fetchDayData().then(() => setIsLoading(false));
	};

	const graphData = {
		labels: dayData.map((i) => {
			return `${i.hour}:00`;
		}),
		datasets: [
			{
				label: "Average speed",
				data: dayData.map((i) => i.averageSpeed),
				fill: false,
				borderColor: "rgba(75, 192, 192, 1)",
				lineTension: 0.1,
			},
		],
	};

	const graphOptions: ChartOptions<"line"> = {
		scales: {
			y: {
				beginAtZero: true,
				suggestedMax: 100,
				title: {
					text: "Speed",
					display: true,
				},
			},
			x: {
				title: {
					text: "Time of day",
					display: true,
				},
			},
		},
		maintainAspectRatio: false,
	};

	return (
		<div className="mainContent">
			{APIon ? (
				isLoading ? (
					<div>Getting data ...</div>
				) : (
					<>
						<div>
							<label htmlFor="date">Choose date:</label>
							<select
								className="form-select possible-dates"
								id="date"
								value={selectedDate}
								onChange={(e) => {
									setSelectedDate(e.target.value);
									updateGraph(e.target.value);
								}}>
								{dateOptions.map((dates) => {
									return (
										<option
											value={dates}
											key={dates}>
											{dates}
										</option>
									);
								})}
							</select>
						</div>
						<div style={{ width: "800px", height: "600px" }}>
							<Line
								data={graphData}
								options={graphOptions}
							/>
						</div>
					</>
				)
			) : (
				<div>Connecting to Database ...</div>
			)}
		</div>
	);
};
