import { ChangeEvent, useState } from "react";
import { RoadEntries } from "../components/types/RoadEntries";
import { stringToRoadEntryArray } from "../components/helperFunctions/uploadContentToRoadEntriesList";
import { SERVER_URL } from "../components/constants/ServerUrl";
import { splitContent } from "../components/helperFunctions/splitInputContentInBatches";

export const UploadFile = () => {
	const [file, setFile] = useState<File>();
	const [textEntries, setTextEntries] = useState<RoadEntries[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			var loadedFile = e.target.files[0];
			var textType = /text.*/;
			setIsLoading(true);
			if (loadedFile.type.match(textType)) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var content = reader.result as string;
					setTextEntries(stringToRoadEntryArray(content));
					alert("File content has been read successfully");
				};

				reader.readAsText(loadedFile);
			}

			setFile(e.target.files[0]);
		}
		setIsLoading(false);
	};

	const handleUploadClick = () => {
		if (!file) {
			return;
		}

		if (!!textEntries) {
			setIsLoading(true);
			splitContent(textEntries).forEach(async (batch) => {
				await fetch(SERVER_URL, {
					method: "POST",
					body: JSON.stringify(batch),
					headers: {
						"content-type": "application/json",
					},
				})
					.then((res) => res.json())
					.catch((err) => console.error(err));
			});
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="input-group mb-3">
				<input
					className="form-control"
					type="file"
					accept=".txt"
					onChange={handleFileChange}
				/>
			</div>
			<div>
				{textEntries &&
					`${textEntries?.length} entries prepered to be sent to server`}
			</div>
			<button
				className="btn btn-primary"
				onClick={handleUploadClick}>
				Send
			</button>
			{isLoading && <div>Loading...</div>}
		</>
	);
};
