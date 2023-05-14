import { useEffect, useState } from "react";
import { SERVER_URL } from "../components/constants/ServerUrl";

import { Line } from "react-chartjs-2";
import { DayHourSpeed } from "../components/types/DayHourSpeeds";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export const Graphics = () => {
	const [dateOptions, setDateOptions] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [dayData, setDayData] = useState<DayHourSpeed[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetch(`${SERVER_URL}?date=0000-00-00`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const recivedData: string[] = await data.json();

				setDateOptions(recivedData.map((item) => item.toString()));
				updateGraph(recivedData[0]);
			} catch (error) {
				console.log("error", error);
			}
		};

		fetchData();
	}, []);

	const updateGraph = (date: string) => {
		const fetchData = async () => {
			try {
				const data = await fetch(`${SERVER_URL}?date=${date}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const recivedData: DayHourSpeed[] = await data.json();

				const allHoursData: DayHourSpeed[] = Array.from(Array(24).keys()).map(
					(h) => {
						const eachHour = recivedData.find((e) => e.hour === h);
						if (eachHour) {
							return { hour: h, averageSpeed: eachHour.averageSpeed };
						}

						return { hour: h, averageSpeed: 0 };
					}
				);

				allHoursData.sort((a, b) => a.hour - b.hour);

				setDayData(allHoursData);
			} catch (error) {
				console.log("error", error);
			}
		};

		fetchData();
	};

	const data = {
		labels: dayData.map((i) => i.hour),
		datasets: [
			{
				label: "Vidējais ātrums",
				data: dayData.map((i) => i.averageSpeed),
				fill: false,
				borderColor: "rgba(75, 192, 192, 1)",
				lineTension: 0.1,
			},
		],
	};

	const options = {
		scales: {
			y: { beginAtZero: true },
		},
		maintainAspectRatio: false,
	};

	return (
		<div>
			{dateOptions.length > 0 ? (
				<div>
					<label htmlFor="date">Izvēlies intresējošo datumu:</label>
					<select
						id="date"
						value={selectedDate}
						onChange={(e) => {
							setSelectedDate(e.target.value);
							updateGraph(e.target.value);
						}}>
						{dateOptions.map((item) => {
							return (
								<option
									value={item}
									key={item}>
									{item}
								</option>
							);
						})}
					</select>
				</div>
			) : (
				<div>Nav pieejamu datu</div>
			)}
			<div style={{ width: "500px", height: "300px" }}>
				<Line
					data={data}
					options={options}
				/>
			</div>
		</div>
	);
};
