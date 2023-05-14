import React, { useEffect, useState } from "react";
import { RoadEntries } from "../components/types/RoadEntries";
import { SERVER_URL } from "../components/constants/ServerUrl";
import { editTimeOfRecord } from "../components/helperFunctions/editServerDataTime";
import { Filter } from "../components/types/Filter";
import moment from "moment";
import { PaginationData } from "../components/types/Pagination";


export const Graphics = () => {

	// useEffect(() => {
	// 	// const fetchData = async () => {
	// 	// 	try {
	// 	// 		setIsLoading(true);
	// 	// 		const data = await fetch(SERVER_URL, {
	// 	// 			method: "GET",
	// 	// 			headers: {
	// 	// 				"Content-Type": "application/json",
	// 	// 			},
	// 	// 		});

	// 	// 		const recivedData = await data.json();
	// 	// 		setServerData(editTimeOfRecord(recivedData));
	// 	// 		setIsLoading(false);
	// 	// 	} catch (error) {
	// 	// 		setIsLoading(false);
	// 	// 		console.log("error", error);
	// 	// 	}
	// 	// };

	// 	// fetchData();

	// 	filterData(newSelect);
	// }, []);

	const [serverData, setServerData] = useState<RoadEntries[] | null>(null);
	const [filterDateFrom, setFilterDateFrom] = useState("");
	const [filterDateTo, setFilterDateTo] = useState("");
	const [filterSpeed, setFilterSpeed] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
	const [hasNextPage, setHasNextPage] = useState<boolean>(false);

	const newSelect = {
		dateFrom: moment.utc(filterDateFrom, "YYYY-MM-DD HH:mm:ss").toISOString(),
		dateTo: moment.utc(filterDateTo, "YYYY-MM-DD HH:mm:ss").toISOString(),
		minimalSpeed: filterSpeed,
	};

	useEffect(() => {
		filterData(newSelect);
	}, [currentPage]);

	const filterData = (filter: Filter) => {
		const sendFilter = async () => {
			try {
				setIsLoading(true);
				const data = await fetch(
					`${SERVER_URL}/filtered?page=${currentPage}&itemsperpage=20`,
					{
						method: "POST",
						body: JSON.stringify(filter),
						headers: {
							"content-type": "application/json",
						},
					}
				);

				const recivedData = await data.json();

				const paginationMeta = JSON.parse(
					data.headers.get("X-Pagination") as string
				) as PaginationData;

				setTotalPages(paginationMeta.TotalPages);
				setTotalCount(paginationMeta.TotalCount);
				setHasPreviousPage(paginationMeta.HasPrevious);
				setHasNextPage(paginationMeta.HasNext);
				setServerData(editTimeOfRecord(recivedData));
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				console.log("error", error);
			}
		};

		sendFilter();
	};

	return (
		<div>
			<form
				className="row g-3"
				onSubmit={(event) => {
					event.preventDefault();
					filterData(newSelect);
				}}>
				<label className="form-label">
					Dati no:
					<input
						type="date"
						className="form-control"
						value={filterDateFrom}
						onChange={(event) => {
							setFilterDateFrom(event.target.value);
						}}
					/>
				</label>
				<label className="form-label">
					Dati līdz:
					<input
						type="date"
						className="form-control"
						value={filterDateTo}
						onChange={(event) => {
							setFilterDateTo(event.target.value);
						}}
					/>
				</label>
				<label className="form-label">
					Minimālais ātrums:
					<input
						type="text"
						className="form-control"
						value={filterSpeed}
						onChange={(event) => {
							const newSpeed = event.target.value;
							setFilterSpeed(parseInt(newSpeed));
						}}
					/>
				</label>

				<button
					type="submit"
					className="btn btn-primary mb-3">
					Submit
				</button>
			</form>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div>
					{totalCount} entries found. Page {currentPage} of {totalPages}
				</div>
			)}
			{!!serverData ? (
				<div>
					<button
						disabled={!hasPreviousPage}
						onClick={() => setCurrentPage(currentPage - 1)}>
						Previous
					</button>
					<button
						disabled={!hasNextPage}
						onClick={() => setCurrentPage(currentPage + 1)}>
						Next
					</button>
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Time of record</th>
								<th scope="col">Speed</th>
								<th scope="col">Car registration number</th>
							</tr>
						</thead>
						<tbody>
							{serverData.map((entry, index) => {
								return (
									<tr key={entry.id}>
										<td>{(currentPage - 1) * 20 + 1 + index}</td>
										<td>{entry.timeOfRecord}</td>
										<td>{entry.speed}</td>
										<td>{entry.carRegistration}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : null}
		</div>
	);
};
