import { useCallback, useMemo, useState } from "react";
import {
	ReactFlow,
	Background,
	BackgroundVariant,
	useReactFlow,
} from "@xyflow/react";
import TableNode from "../table-node";
import SimpleFloatingEdge from "../simple-floating-edge";
import { getDefaultColumns, getNewId } from "../../util/table-util";
import { useToolbar } from "../../context/toolbar-context";
import ToolEnum from "../../enum/tool-enum";
import { useTable } from "../../context/table-context";
import "@xyflow/react/dist/style.css";
import "./style.css";

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
	const [toolSelectedNodeTable, setToolSelectedNodeTable] = useState(null);

	const nodeTypes = useMemo(() => ({ table: TableNode }), []);
	const edgeTypes = useMemo(
		() => ({
			floating: SimpleFloatingEdge,
		}),
		[],
	);

	const onCanvasClick = useCallback(
		(event: any) => {
			switch (currentTool) {
				case ToolEnum.CREATE_TABLE:
					const tableNome = createNewTable(event);
					setCurrentTool(ToolEnum.SELECT);
					setSelectedTable(tableNome.data);
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
					createOneToManyRelationship(toolSelectedNodeTable, node);
					setToolSelectedNodeTable(null);
					setCurrentTool(ToolEnum.SELECT);
				}
				break;
			case ToolEnum.MANY_TO_MANY:
				if (!toolSelectedNodeTable) {
					setToolSelectedNodeTable(node);
				} else {
					createManyToManyRelationship(toolSelectedNodeTable, node);
					setToolSelectedNodeTable(null);
					setCurrentTool(ToolEnum.SELECT);
				}
				break;
			default:
				break;
		}
	};

	const onTableDoubleClick = (_event: any, node: any) => {
		setSelectedTable(node.data);
	};

	const createNewTable = (event: any) => {
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
				constraints: [],
			},
		};
		setNodes((nds: any[]) => {
			return nds.concat(newNode);
		});
		return newNode;
	};

	const createOneToManyRelationship = (sourceNode: any, targetNode: any) => {
		const targetPrimaryKeys = targetNode.data.columns.filter(
			(column: any) => column.is_primary_key,
		);

		const newConstraint: any = {
			id: getNewId(),
			relationships: [],
			target_table_id: targetNode.id,
			type: 0,
		};

		for (const primaryKey of targetPrimaryKeys) {
			const newColumn = {
				id: getNewId(),
				name: targetNode.data.name + "_" + primaryKey.name,
				type: primaryKey.type,
				is_primary_key: false,
				is_not_null: true,
				is_unique: false,
				is_auto_increment: false,
			};
			sourceNode.data.columns.push(newColumn);
			newConstraint.relationships.push({
				own_column_id: newColumn.id,
				target_column_id: primaryKey.id,
			});

			const newEdge = {
				id: getNewId(),
				source: sourceNode.id.toString(),
				sourceHandle: newColumn.id + "_source",
				target: targetNode.id.toString(),
				targetHandle: primaryKey.id + "_target",
				type: "floating",
				data: {
					contraint_id: newConstraint.id,
				},
			};

			reactFlow.addEdges([newEdge]);
		}

		sourceNode.data.constraints.push(newConstraint);
		reactFlow.updateNode(sourceNode.id, { data: sourceNode.data });
	};

	const createManyToManyRelationship = (sourceNode: any, targetNode: any) => {
		const targetPrimaryKeys = targetNode.data.columns.filter(
			(column: any) => column.is_primary_key,
		);

		const sourcePrimaryKeys = sourceNode.data.columns.filter(
			(column: any) => column.is_primary_key,
		);

		const middlePosition = {
			x: (sourceNode.position.x + targetNode.position.x) / 2,
			y: (sourceNode.position.y + targetNode.position.y) / 2,
		};

		const newIntermediateTable: any = {
			id: getNewId(),
			type: "table",
			position: middlePosition,
			origin: [0.5, 0.0],
			data: {
				name: sourceNode.data.name + "_" + targetNode.data.name,
				columns: [],
				constraints: [],
			},
		};
		reactFlow.addNodes([newIntermediateTable]);

		// add the constraints of the source node
		const sourceConstraint: any = {
			id: getNewId(),
			relationships: [],
			target_table_id: sourceNode.id,
			type: 1,
		};

		for (const primaryKey of sourcePrimaryKeys) {
			const newColumn: any = {
				id: getNewId(),
				name: sourceNode.data.name + "_" + primaryKey.name,
				type: primaryKey.type,
				is_primary_key: true,
				is_not_null: false,
				is_unique: false,
				is_auto_increment: false,
			};
			newIntermediateTable.data.columns.push(newColumn);
			sourceConstraint.relationships.push({
				own_column_id: newColumn.id,
				target_column_id: primaryKey.id,
			});

			const newEdge = {
				id: getNewId(),
				source: newIntermediateTable.id.toString(),
				sourceHandle: newColumn.id + "_source",
				target: sourceNode.id.toString(),
				targetHandle: primaryKey.id + "_target",
				type: "floating",
				data: {
					contraint_id: sourceConstraint.id,
				},
			};

			reactFlow.addEdges([newEdge]);
		}

		newIntermediateTable.data.constraints.push(sourceConstraint);
		reactFlow.updateNode(newIntermediateTable.id, {
			data: newIntermediateTable.data,
		});

		// add the constraints of the target node
		const targetConstraint: any = {
			id: getNewId(),
			relationships: [],
			target_table_id: targetNode.id,
			type: 1,
		};

		for (const primaryKey of targetPrimaryKeys) {
			const newColumn: any = {
				id: getNewId(),
				name: targetNode.data.name + "_" + primaryKey.name,
				type: primaryKey.type,
				is_primary_key: true,
				is_not_null: false,
				is_unique: false,
				is_auto_increment: false,
			};
			newIntermediateTable.data.columns.push(newColumn);
			targetConstraint.relationships.push({
				own_column_id: newColumn.id,
				target_column_id: primaryKey.id,
			});

			const newEdge = {
				id: getNewId(),
				source: newIntermediateTable.id.toString(),
				sourceHandle: newColumn.id + "_source",
				target: targetNode.id.toString(),
				targetHandle: primaryKey.id + "_target",
				type: "floating",
				data: {
					contraint_id: targetConstraint.id,
				},
			};

			reactFlow.addEdges([newEdge]);
		}

		newIntermediateTable.data.constraints.push(targetConstraint);
		reactFlow.updateNode(newIntermediateTable.id, {
			data: newIntermediateTable.data,
		});
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
				minZoom={0.2}
				onPaneClick={onCanvasClick}
				onNodeClick={onTableClick}
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
