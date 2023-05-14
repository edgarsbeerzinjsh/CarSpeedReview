import React, { ChangeEvent, useState } from "react";

import moment from "moment";

// interface RoadEntry {
//   id?: number;
//   timeOfRecord: string;
//   speed: number;
//   carRegistration: string;
// };

type RoadEntries = {
	id?: number;
	timeOfRecord: string;
	speed: number;
	carRegistration: string;
};

export function AppFirstTry() {
	const [file, setFile] = useState<File>();
	const [textEntries, setTextEntries] = useState<RoadEntries[] | null>(null);
	const [serverData, setServerData] = useState<RoadEntries[] | null>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			var loadedFile = e.target.files[0];
			var textType = /text.*/;
			if (loadedFile.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function (e) {
					var content = reader.result as string;
					//Here the content has been read successfuly
					const textByLine = content?.split(/\r\n|\r|\n/);

					const textByEntry = textByLine?.map((line) => {
						const entry = line.split(/\t/);
						const oneEntry = {
							timeOfRecord: moment.utc(entry[0], "YYYY-MM-DD HH:mm:ss").toISOString(),
							speed: +entry[1],
							carRegistration: entry[2],
						};
						return oneEntry;
					});

					setTextEntries(textByEntry);

					//setText(content as string);
					alert("File content has been read successfully");
				};

				reader.readAsText(loadedFile);
			}
			setFile(e.target.files[0]);
		}
	};

	//console.log(file?.type);
	//console.log(textByEntry);
	//console.log(textByEntry? textByEntry[0]: null);

	console.log(textEntries);

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}
		const entrybody = JSON.stringify(textEntries);
		console.log(entrybody);
		// 👇 Uploading the file using the fetch API to the server
		textEntries?.map(async (line) => {
			await fetch("http://localhost:5000/Data", {
				method: "POST",
				body: JSON.stringify(line),
				// 👇 Set headers manually for single file upload
				headers: {
					"content-type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => console.log(data))
				.catch((err) => console.error(err));
		});
	};

	const handleDownloadClick = () => {
		const fetchData = async () => {
			try {
				const data = await fetch("http://localhost:5000/Data", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const serverD = await data.json();
				//console.log(serverD);
        const betterDate = serverD.map((item: any) => {
          const toIsoDate = moment(item.timeOfRecord);
          return {...item, timeOfRecord: toIsoDate.format("YYYY-MM-DD HH:mm:ss")};
        });
				// const toRoadE: RoadEntry[] = serverD.map((item: any)=>{return (item as RoadEntry);});
				// console.log("after", toRoadE);
				// console.log(toRoadE.length);
				// console.log(toRoadE);
				// const a = toRoadE[0]?.speed;
				// console.log(a);
			  //console.log(betterDate);

				setServerData(betterDate);
			} catch (error) {
				console.log("error", error);
			}
		};

		fetchData();
	};

	//console.log(serverData);
	//console.log(typeof serverData);
	//console.log(serverData? serverData[0].CarRegistration: null);

	return (
		<div>
			<input
				type="file"
				onChange={handleFileChange}
			/>

			<div>{file && `${file.name} - ${file.type}`}</div>

			<button onClick={handleUploadClick}>Upload</button>
			<button onClick={handleDownloadClick}>Download</button>
			{!!serverData ? (
				<div>
					<p>{serverData.length}</p>
					<div>
						{serverData.map((entry) => {
							return (
								<div key={entry.id} className="entry-row">
									<div>{entry.timeOfRecord}</div>
									<div>{entry.speed}</div>
									<div>{entry.carRegistration}</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
