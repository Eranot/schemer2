import { useEffect, useMemo, useState } from "react";
import { Node, useReactFlow } from "@xyflow/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
	createJsonByER,
	getDefaultEr,
	loadERFromJSON,
} from "../../util/load-util";
import { useTable } from "../../context/table-context";
import MenuBar from "../menu-bar";
import Toolbar from "../tool-bar";
import Canvas from "../canvas";
import SidePanel from "../side-panel";
import { useEditor } from "../../context/editor-context";
import ToolEnum from "../../enum/tool-enum";
import { useToolbar } from "../../context/toolbar-context";
import createTableIcon from "../../assets/create_table_icon_normal.png";
import oneToManyIcon from "../../assets/one_to_many_icon_normal.png";
import manyToManyIcon from "../../assets/many_to_many_icon_normal.png";
import Table from "../../type/table";

export default function Editor() {
	const reactFlow = useReactFlow();
	const { setNodes, setEdges } = useEditor();
	const { currentTool } = useToolbar();
	const { selectedTable } = useTable();

	const [cursorX, setCursorX] = useState(0);
	const [cursorY, setCursorY] = useState(0);

	const handleMouseMove = (event: any) => {
		setCursorX(event.pageX + 15);
		setCursorY(event.pageY + 15);
	};

	const handleMouseLeave = () => {
		setCursorX(-100);
		setCursorY(-100);
	};

	const currentCursorIcon = useMemo(() => {
		switch (currentTool) {
			case ToolEnum.CREATE_TABLE:
				return createTableIcon;
			case ToolEnum.ONE_TO_MANY:
				return oneToManyIcon;
			case ToolEnum.MANY_TO_MANY:
				return manyToManyIcon;
			default:
				return undefined;
		}
	}, [currentTool]);

	useEffect(() => {
		// If there is a saved state on local storage, load it
		const editor = localStorage.getItem("editor");
		if (editor) {
			const er = JSON.parse(editor);
			let { initialNodes, initialEdges } = loadERFromJSON(er);
			setNodes(initialNodes);
			setEdges(initialEdges);
		} else {
			let { initialNodes, initialEdges } = loadERFromJSON(getDefaultEr());
			setNodes(initialNodes);
			setEdges(initialEdges);
		}

		// Every 10s, save the current state of the editor on local storage
		const interval = setInterval(() => {
			localStorage.setItem(
				"editor",
				JSON.stringify(
					createJsonByER(reactFlow.getNodes() as Node<Table>[]),
				),
			);
		}, 10000);

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="App">
			<MenuBar />
			<PanelGroup direction="horizontal" autoSaveId="editor">
				<Toolbar />
				<Panel id="canvas">
					<Canvas />
				</Panel>
				{selectedTable && (
					<>
						<PanelResizeHandle />
						<Panel id="sidebar" style={{ minWidth: 400 }}>
							<SidePanel />
						</Panel>
					</>
				)}
			</PanelGroup>
			<img
				className="CustomCursorIcon"
				src={currentCursorIcon}
				style={{
					top: cursorY,
					left: cursorX,
				}}
				data-active={currentTool !== ToolEnum.SELECT}
			/>
		</div>
	);
}
