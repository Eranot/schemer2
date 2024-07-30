import { ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { ToolbarProvider } from "./context/toolbar-context";
import { TableProvider } from "./context/table-context";
import Editor from "./component/editor";
import { EditorProvider } from "./context/editor-context";

export default function App() {
	return (
		<EditorProvider>
			<ToolbarProvider>
				<TableProvider>
					<ReactFlowProvider>
						<Editor />
					</ReactFlowProvider>
				</TableProvider>
			</ToolbarProvider>
		</EditorProvider>
	);
}
