import { useEffect, useState } from "react";
import { RoadEntries } from "../components/types/RoadEntries";
import { SERVER_LINKS } from "../components/constants/ServerUrl";
import { editTimeOfRecord } from "../components/helperFunctions/editServerDataTime";
import { Filter } from "../components/types/Filter";
import moment from "moment";
import { PaginationData } from "../components/types/Pagination";
import { ping } from "../components/helperFunctions/ping";

export const DataContent = () => {
	const [serverData, setServerData] = useState<RoadEntries[] | null>(null);
	const [filterDateFrom, setFilterDateFrom] = useState("");
	const [filterDateTo, setFilterDateTo] = useState("");
	const [filterSpeed, setFilterSpeed] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
	const [hasNextPage, setHasNextPage] = useState<boolean>(false);
	const [goToPage, setGoToPage] = useState<number>(1);
	const [APIon, setAPIon] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentFilter, setCurrentFilter] = useState<Filter>({
		dateFrom: "",
		dateTo: "",
		minimalSpeed: 0,
	});

	useEffect(() => {
		const apiState = ping();
		apiState.then((result) => setAPIon(result));
	}, []);

	useEffect(() => {
		setIsLoading(true);

		fetchData();
	}, [currentPage, currentFilter]);

	const fetchData = async () => {
		try {
			const data = await fetch(fetchLinkBuilder(), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const recivedData = await data.json();
			console.log(recivedData);
			const paginationMeta = JSON.parse(
				data.headers.get("X-Pagination") as string
			) as PaginationData;

			setTotalPages(paginationMeta.TotalPages);
			setTotalCount(paginationMeta.TotalCount);
			setHasPreviousPage(paginationMeta.HasPrevious);
			setHasNextPage(paginationMeta.HasNext);
			setServerData(editTimeOfRecord(recivedData));
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchLinkBuilder = () => {
		let fetchLink = `${SERVER_LINKS.FILTERED}?page=${currentPage}`;
		if (currentFilter.dateFrom) {
			fetchLink += `&datefrom=${currentFilter.dateFrom}`;
		}
		if (currentFilter.dateTo) {
			fetchLink += `&dateto=${currentFilter.dateTo}`;
		}
		if (currentFilter.minimalSpeed) {
			fetchLink += `&minimalspeed=${currentFilter.minimalSpeed}`;
		}

		return fetchLink;
	};

	const convertToPossiblePage = (numberToCheck: number) => {
		return (numberToCheck = isNaN(numberToCheck)
			? 1
			: numberToCheck > totalPages
			? totalPages
			: numberToCheck <= 0
			? 1
			: numberToCheck);
	};

	return (
		<div className="mainContent">
			{APIon ? (
				<>
					<form
						className="row g-3"
						onSubmit={(event) => {
							event.preventDefault();
							setIsLoading(true);
							setCurrentPage(1);
							setGoToPage(1);
							setCurrentFilter({
								dateFrom: moment
									.utc(filterDateFrom, "YYYY-MM-DD HH:mm:ss")
									.toISOString(),
								dateTo: moment
									.utc(filterDateTo, "YYYY-MM-DD HH:mm:ss")
									.toISOString(),
								minimalSpeed: filterSpeed,
							});
						}}>
						<div>
							<label className="form-label">
								Data from:
								<input
									type="date"
									className="form-control possible-dates"
									value={filterDateFrom}
									onChange={(event) => {
										setFilterDateFrom(event.target.value);
									}}
								/>
							</label>
							<label className="form-label">
								Data to:
								<input
									type="date"
									className="form-control possible-dates"
									value={filterDateTo}
									onChange={(event) => {
										setFilterDateTo(event.target.value);
									}}
								/>
							</label>
							<label className="form-label">
								Maximum speed:
								<input
									type="text"
									className="form-control speed-filter"
									value={filterSpeed}
									onChange={(event) => {
										let newSpeed = parseInt(event.target.value);
										if (isNaN(newSpeed)) {
											newSpeed = 0;
										}
										setFilterSpeed(newSpeed);
									}}
								/>
							</label>
							<button
								className="btn btn-primary submit-filter-button"
								type="submit">
								Submit
							</button>
						</div>
					</form>
					{isLoading || !serverData ? (
						<div>Getting data...</div>
					) : (
						<>
							<>
								{!!currentFilter.dateFrom && (
									<div>
										Date from filter:{" "}
										{moment(currentFilter.dateFrom).format("YYYY-MM-DD")}
									</div>
								)}
								{!!currentFilter.dateTo && (
									<div>
										Date to filter:{" "}
										{moment(currentFilter.dateTo).format("YYYY-MM-DD")}
									</div>
								)}
								{!!currentFilter.minimalSpeed && (
									<div>Minimal speed filter: {currentFilter.minimalSpeed}</div>
								)}
							</>
							<p>
								{totalCount} entries found. Page {currentPage} of {totalPages}
							</p>
							<div>
								<div className="paging-navigation">
									<div className="previous-next-buttons">
										<button
											className="btn btn-primary mb-3 navigation-button"
											disabled={!hasPreviousPage}
											onClick={() => {
												setCurrentPage(currentPage - 1);
												setGoToPage(currentPage - 1);
											}}>
											Previous
										</button>
										<button
											className="btn btn-primary mb-3 navigation-button"
											disabled={!hasNextPage}
											onClick={() => {
												setCurrentPage(currentPage + 1);
												setGoToPage(currentPage + 1);
											}}>
											Next
										</button>
									</div>
									<form
										className="input-group mb-3 choose-page"
										onSubmit={(event) => {
											event.preventDefault();
											setCurrentPage(goToPage);
										}}>
										<label className="input-group-text ">Choose page:</label>
										<input
											type="text"
											className="form-control goto-page-space"
											value={goToPage}
											onChange={(event) => {
												let newPage = parseInt(event.target.value);
												setGoToPage(convertToPossiblePage(newPage));
											}}
										/>
										<button
											type="submit"
											className="btn btn-primary">
											Go
										</button>
									</form>
								</div>
								<table className="table table-striped table-bordered">
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
													<td>{entry.carRegistrationNumber}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</>
			) : (
				<div>Connecting to Database ...</div>
			)}
		</div>
	);
};
