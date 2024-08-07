import { useCallback } from "react";
import {
	ReactFlow,
	Background,
	BackgroundVariant,
	useReactFlow,
	Node,
	NodeChange,
	applyNodeChanges,
	EdgeChange,
	applyEdgeChanges,
} from "@xyflow/react";
import TableNode from "../table-node";
import SimpleFloatingEdge from "../simple-floating-edge";
import {
	createManyToManyRelationship,
	createNewTable,
	createOneToManyRelationship,
} from "../../util/table-util";
import { useToolbar } from "../../context/toolbar-context";
import { useEditor } from "../../context/editor-context";
import { useTable } from "../../context/table-context";
import ToolEnum from "../../enum/tool-enum";
import Table from "../../type/table";
import "@xyflow/react/dist/style.css";
import "./style.css";

export default function Canvas() {
	const reactFlow = useReactFlow();
	const { currentTool, setCurrentTool } = useToolbar();
	const { setSelectedTable } = useTable();
	const {
		nodes,
		setNodes,
		edges,
		setEdges,
		toolSelectedNodeTable,
		setToolSelectedNodeTable,
	} = useEditor();

	const nodeTypes = { table: TableNode };
	const edgeTypes = {
		floating: SimpleFloatingEdge,
	};

	const onNodesChange = useCallback(
		(changes: NodeChange[]) =>
			setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
		[setNodes],
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) =>
			setEdges((eds: any) => applyEdgeChanges(changes, eds)),
		[setEdges],
	);

	const onCanvasClick = useCallback(
		(event: any) => {
			switch (currentTool) {
				case ToolEnum.CREATE_TABLE:
					const tableNome = createNewTable(
						reactFlow.screenToFlowPosition({
							x: event.clientX,
							y: event.clientY,
						}),
						reactFlow,
					);
					setSelectedTable(tableNome.data);
					setCurrentTool(ToolEnum.SELECT);
					break;
				default:
					break;
			}
		},
		[currentTool],
	);

	const onTableClick = (_event: any, node: any) => {
		switch (currentTool) {
			case ToolEnum.ONE_TO_MANY:
				if (!toolSelectedNodeTable) {
					setToolSelectedNodeTable(node);
				} else {
					createOneToManyRelationship(
						toolSelectedNodeTable,
						node,
						reactFlow,
					);
					setToolSelectedNodeTable(null);
					setCurrentTool(ToolEnum.SELECT);
				}
				break;
			case ToolEnum.MANY_TO_MANY:
				if (!toolSelectedNodeTable) {
					setToolSelectedNodeTable(node);
				} else {
					createManyToManyRelationship(
						toolSelectedNodeTable,
						node,
						reactFlow,
					);
					setToolSelectedNodeTable(null);
					setCurrentTool(ToolEnum.SELECT);
				}
				break;
			default:
				break;
		}
	};

	const onTableDoubleClick = (_event: any, node: Node) => {
		setSelectedTable(node.data as Table);
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
				proOptions={{ hideAttribution: true }}
				minZoom={0.2}
				onPaneClick={onCanvasClick}
				onNodeClick={onTableClick}
				onNodeDoubleClick={onTableDoubleClick}
				zoomOnDoubleClick={false}
				onPaneContextMenu={(event) => {
					setSelectedTable(null);
					setToolSelectedNodeTable(null);
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
