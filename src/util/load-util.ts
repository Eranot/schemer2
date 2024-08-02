import { getNewId } from "./table-util";

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

export function crateJsonByER(nodes: any, edges: any) {
	const tables = nodes.map((node: any) => {
		return {
			id: parseInt(node.id),
			name: node.data.name,
			position: node.position,
			size: node.size,
			columns: node.data.columns,
			constraints: node.data.constraints,
		};
	});

	return {
		tables,
		version: 1,
	};
}
