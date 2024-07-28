import { useCallback, useEffect, useMemo } from "react";
import {
	ReactFlow,
	Background,
	BackgroundVariant,
	useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TableNode from "../table-node";
import SimpleFloatingEdge from "../simple-floating-edge";
import { getDefaultColumns, getNewId } from "../../util/table-util";
import { useToolbar } from "../../context/toolbar-context";
import ToolEnum from "../../enum/tool-enum";
import { useTable } from "../../context/table-context";

export default function Canvas({
	nodes,
	edges,
	onNodesChange,
	onEdgesChange,
	onConnect,
	setNodes,
}: any) {
	const reactFlow = useReactFlow();
	const { currentTool, setCurrentTool } = useToolbar();
	const { setSelectedTable } = useTable();

	const nodeTypes = useMemo(() => ({ table: TableNode }), []);
	const edgeTypes = useMemo(
		() => ({
			floating: SimpleFloatingEdge,
		}),
		[],
	);

	const onClickCapture = useCallback(
		(event: any) => {
			switch (currentTool) {
				case ToolEnum.CREATE_TABLE:
					const tableNome = createTable(event);
					setCurrentTool(ToolEnum.SELECT);
					setSelectedTable(tableNome.data);
					break;
				default:
					break;
			}
		},
		[currentTool],
	);

	const onTableDoubleClick = (event: any, node: any) => {
		setSelectedTable(node.data);
	};

	const createTable = (event: any) => {
		const newNode = {
			id: getNewId(),
			type: "table",
			position: reactFlow.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			}),
			data: {
				name: "new_table",
				columns: getDefaultColumns(),
			},
		};
		setNodes((nds: any[]) => {
			return nds.concat(newNode);
		});
		return newNode;
	};

	return (
		<div style={{ height: "100%", flexGrow: 1 }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				proOptions={{ hideAttribution: true }}
				minZoom={0.1}
				onPaneClick={onClickCapture}
				onNodeDoubleClick={onTableDoubleClick}
				zoomOnDoubleClick={false}
				onPaneContextMenu={(event) => {
					setSelectedTable(null);
					event.preventDefault();
				}}
				onNodeContextMenu={(event) => {
					event.preventDefault();
				}}
			>
				<Background
					variant={BackgroundVariant.Dots}
					bgColor="#fcfeff"
					gap={12}
					size={1}
				/>
			</ReactFlow>
		</div>
	);
}
