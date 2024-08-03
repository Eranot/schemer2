import { Node } from "@xyflow/react";
import { getNewId } from "./table-util";
import Table from "../type/table";

export function getDefaultEr() {
	return {
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
						name: "name",
						type: "varchar",
					},
				],
				constraints: [],
				id: 1324743907,
				name: "person",
				position: {
					x: 800,
					y: 350,
				},
			},
		],
		version: 1,
	};
}

export function loadERFromJSON(er: any) {
	// For retro-compatibility, add id to relationships if it doesn't exist
	er.tables.forEach((table: any) => {
		table.id = table.id || getNewId();
		table.constraints.forEach((constraint: any) => {
			constraint.relationships.forEach((relationship: any) => {
				relationship.id = relationship.id || getNewId();
			});
		});
	});

	const initialNodes = er.tables.map((table: any) => {
		return {
			id: table.id.toString(),
			type: "table",
			position: table.position,
			data: table,
		};
	});

	const initialEdges = er.tables
		.map((table: any) => {
			return table.constraints
				.map((constraint: any) => {
					return constraint.relationships.map(
						(relationship: any) => ({
							id: relationship.id.toString(),
							source: table.id.toString(),
							sourceHandle:
								relationship.own_column_id.toString() +
								"_source",
							target: constraint.target_table_id.toString(),
							targetHandle:
								relationship.target_column_id.toString() +
								"_target",
							type: "floating",
						}),
					);
				})
				.flat();
		})
		.flat();

	return {
		initialNodes,
		initialEdges,
	};
}

export function createJsonByER(nodes: Node<Table>[]) {
	const tables: Table[] = nodes.map((node: Node<Table>) => {
		return {
			id: parseInt(node.id),
			name: node.data.name,
			position: node.position,
			columns: node.data.columns,
			constraints: node.data.constraints,
		};
	});

	return {
		tables,
		version: 1,
	};
}
