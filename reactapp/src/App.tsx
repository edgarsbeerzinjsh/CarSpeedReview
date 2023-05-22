import "./App.css";
import {Routes, Route} from "react-router-dom";
import { UploadFile } from "./views/UploadFile";
import { DataContent } from "./views/DataContent";
import { Graphics } from "./views/Graphics";
import { NavPages } from "./components/NavPages";




export function App() {
	return (
		<div>
			<NavPages />
			<Routes>
				<Route path="/" element={<UploadFile />} />
				<Route path="/data" element={<DataContent />} />
				<Route path="/graph" element={<Graphics />} />
				<Route path="*" element={<div>404</div>} />
			</Routes>
		</div>
	);
}