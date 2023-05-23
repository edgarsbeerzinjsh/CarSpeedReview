import { ChangeEvent, useEffect, useState } from "react";
import { RoadEntries } from "../components/types/RoadEntries";
import { lineToRoadEntry, stringToArray, } from "../components/helperFunctions/uploadContentToRoadEntriesList";
import { SERVER_LINKS } from "../components/constants/ServerUrl";
import { splitContent } from "../components/helperFunctions/splitInputContentInBatches";
import { ping } from "../components/helperFunctions/ping";
import { TIMOUT_MS } from "../components/constants/TimeoutForLoading";

export const UploadFile = () => {
	const [file, setFile] = useState<File>();
	const [textEntries, setTextEntries] = useState<RoadEntries[] | null>(null);
	const [APIon, setAPIon] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [entriesSent, setEntriesSent] = useState(false);

	useEffect(() => {
		const apiState = ping();
		apiState.then((result) => setAPIon(result));
	}, []);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTimeout(() => {
			if (e.target.files) {
				var loadedFile = e.target.files[0];
				var textType = /text.*/;
				if (loadedFile.type.match(textType)) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var content = reader.result as string;
						setTextEntries(stringToArray(content).map(l => lineToRoadEntry(l)));
						alert("File content has been read successfully");
						setIsLoading(false);
					};

					reader.readAsText(loadedFile);
				}

				setFile(e.target.files[0]);
			}
		}, TIMOUT_MS);
	};

	const handleUploadClick = () => {
		if (!file) {
			return;
		}

		if (!!textEntries) {
			setTimeout(() => {
				const fetchPromises = splitContent(textEntries).map(async (batch) => {
					try {
						const response = await fetch(SERVER_LINKS.UPLOAD, {
							method: "POST",
							body: JSON.stringify(batch),
							headers: {
								"content-type": "application/json",
							},
						});
						console.log(response.status);
					} catch (err) {
						console.error(err);
					}
				});

				Promise.all(fetchPromises)
					.then(() => {
						setIsLoading(false);
						setEntriesSent(true);
					})
					.catch((err) => console.error(err));
			}, TIMOUT_MS);
		}
	};

	return (
		<div className="mainContent">
			{APIon ? (
				<>
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="file"
							accept=".txt"
							onChange={(e) => {
								setIsLoading(true);
								handleFileChange(e);
							}}
						/>
					</div>
					{textEntries && (
						<div>
							{textEntries?.length} entries are prepered to be sent to server
						</div>
					)}
					<button
						className="btn btn-primary"
						onClick={() => {
							setIsLoading(true);
							handleUploadClick();
						}}>
						Send
					</button>
					{entriesSent && <div>All entries sent</div>}
					{isLoading && <div>Loading...</div>}
				</>
			) : (
				<div>Connecting to Database ...</div>
			)}
		</div>
	);
};
