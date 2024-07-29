export function loadERFromJSON(er: any) {
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
						(relationship: any, index: number) => ({
							id: constraint.id.toString() + "_" + index,
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
