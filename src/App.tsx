import { ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { ToolbarProvider } from "./context/toolbar-context";
import { TableProvider } from "./context/table-context";
import Editor from "./component/editor";

export default function App() {
	return (
		<ToolbarProvider>
			<TableProvider>
				<ReactFlowProvider>
					<Editor />
				</ReactFlowProvider>
			</TableProvider>
		</ToolbarProvider>
	);
}
