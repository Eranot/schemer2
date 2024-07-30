import { useCallback, useEffect } from "react";
import {
	addEdge,
	applyNodeChanges,
	applyEdgeChanges,
	Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { loadERFromJSON } from "../../util/load-util";
import { useTable } from "../../context/table-context";
import MenuBar from "../menu-bar";
import ToolbarDemo from "../tool-bar";
import Canvas from "../canvas";
import SidePanel from "../side-panel";
import { useEditor } from "../../context/editor-context";

const er = {
	tables: [
		{
			columns: [
				{
					id: 1905473290,
					is_auto_increment: true,
					is_not_null: false,
					is_primary_key: true,
					is_unique: false,
					name: "id",
					type: "int",
				},
				{
					id: 850743278,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "nome",
					type: "varchar",
				},
				{
					id: 1994210575,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "email",
					type: "varchar",
				},
				{
					id: 1960621910,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "senha",
					type: "varchar",
				},
				{
					id: 1449352601,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "otp_habilitado",
					type: "bool",
				},
				{
					id: 594106162,
					is_auto_increment: false,
					is_not_null: false,
					is_primary_key: false,
					is_unique: false,
					name: "otp_secret",
					type: "varchar",
				},
				{
					id: 1904617998,
					is_auto_increment: false,
					is_not_null: false,
					is_primary_key: false,
					is_unique: false,
					name: "otp_tipo",
					type: "int",
				},
				{
					id: 583268699,
					is_auto_increment: false,
					is_not_null: false,
					is_primary_key: false,
					is_unique: false,
					name: "otp_login_code",
					type: "varchar",
				},
				{
					id: 238041276,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "id_grupo_usuario",
					type: "int",
				},
			],
			constraints: [
				{
					center_point: {
						x: 0,
						y: 0,
					},
					id: 3284679628,
					relationships: [
						{
							own_column_id: 238041276,
							target_column_id: 642437002,
						},
					],
					target_table_id: 4104555537,
					type: 0,
				},
			],
			id: 1324743907,
			name: "usuario",
			position: {
				x: -172,
				y: 81.5,
			},
			size: {
				x: 300,
				y: 402,
			},
		},
		{
			columns: [
				{
					id: 642437002,
					is_auto_increment: true,
					is_not_null: false,
					is_primary_key: true,
					is_unique: false,
					name: "id",
					type: "int",
				},
				{
					id: 600016737,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "descricao",
					type: "varchar",
				},
			],
			constraints: [],
			id: 4104555537,
			name: "grupo_usuario",
			position: {
				x: -631,
				y: 29.5,
			},
			size: {
				x: 300,
				y: 129,
			},
		},
		{
			columns: [
				{
					id: 1270908149,
					is_auto_increment: true,
					is_not_null: false,
					is_primary_key: true,
					is_unique: false,
					name: "id",
					type: "int",
				},
				{
					id: 1380624540,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "descricao",
					type: "varchar",
				},
				{
					id: 1916813467,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "ordem",
					type: "int",
				},
			],
			constraints: [],
			id: 686866920,
			name: "categoria_permissao",
			position: {
				x: -1510.08325195312,
				y: 265.317321777344,
			},
			size: {
				x: 300,
				y: 168.000061035156,
			},
		},
		{
			columns: [
				{
					id: 1782915856,
					is_auto_increment: true,
					is_not_null: false,
					is_primary_key: true,
					is_unique: false,
					name: "id",
					type: "int",
				},
				{
					id: 891962688,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "descricao",
					type: "varchar",
				},
				{
					id: 761083031,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "codigo",
					type: "varchar",
				},
				{
					id: 391857050,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "id_categoria_permissao",
					type: "int",
				},
			],
			constraints: [
				{
					center_point: {
						x: 0,
						y: 0,
					},
					id: 3277510839,
					relationships: [
						{
							own_column_id: 391857050,
							target_column_id: 1270908149,
						},
					],
					target_table_id: 686866920,
					type: 0,
				},
			],
			id: 3626378286,
			name: "permissao",
			position: {
				x: -1122.65478515625,
				y: 228.174499511719,
			},
			size: {
				x: 368,
				y: 207,
			},
		},
		{
			columns: [
				{
					id: 535927279,
					is_auto_increment: true,
					is_not_null: false,
					is_primary_key: true,
					is_unique: false,
					name: "id",
					type: "int",
				},
				{
					id: 1250989492,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "id_grupo_usuario",
					type: "int",
				},
				{
					id: 942694586,
					is_auto_increment: false,
					is_not_null: true,
					is_primary_key: false,
					is_unique: false,
					name: "id_permissao",
					type: "int",
				},
			],
			constraints: [
				{
					center_point: {
						x: -668.684448242188,
						y: 210.265869140625,
					},
					id: 3062790312,
					relationships: [
						{
							own_column_id: 1250989492,
							target_column_id: 642437002,
						},
					],
					target_table_id: 4104555537,
					type: 0,
				},
				{
					center_point: {
						x: 0,
						y: 0,
					},
					id: 3166623126,
					relationships: [
						{
							own_column_id: 942694586,
							target_column_id: 1782915856,
						},
					],
					target_table_id: 3626378286,
					type: 0,
				},
			],
			id: 1348810161,
			name: "grupo_usuario_permissao",
			position: {
				x: -624.368896484375,
				y: 217.03173828125,
			},
			size: {
				x: 300,
				y: 168,
			},
		},
	],
	version: 1,
};

const { initialNodes, initialEdges } = loadERFromJSON(er);

export default function Editor() {
	const { nodes, setNodes, edges, setEdges } = useEditor();

	const { selectedTable } = useTable();

	useEffect(() => {
		setNodes(initialNodes);
		setEdges(initialEdges);
	}, []);

	const onNodesChange = useCallback(
		(changes: any) =>
			setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
		[setNodes],
	);

	const onEdgesChange = useCallback(
		(changes: any) =>
			setEdges((eds: any) => applyEdgeChanges(changes, eds)),
		[setEdges],
	);

	const onConnect = useCallback(
		(params: any) =>
			(setEdges as any)((eds: any[]) =>
				addEdge({ ...params, type: "floating" }, eds),
			),
		[setEdges],
	);

	return (
		<div className="App">
			<MenuBar />
			<PanelGroup direction="horizontal" autoSaveId="editor">
				<ToolbarDemo />
				<Panel id="canvas">
					<Canvas
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						setNodes={setNodes}
					/>
				</Panel>
				{selectedTable && (
					<>
						<PanelResizeHandle />
						<Panel
							id="sidebar"
							style={{ minWidth: 400 }}
							maxSize={40}
						>
							<SidePanel />
						</Panel>
					</>
				)}
			</PanelGroup>
		</div>
	);
}
