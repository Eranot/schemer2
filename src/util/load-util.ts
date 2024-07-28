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
			return table.constraints.map((constraint: any) => {
				return {
					id: constraint.id.toString(),
					source: table.id.toString(),
					sourceHandle:
						constraint.relationships[0].own_column_id.toString() +
						"_source",
					target: constraint.target_table_id.toString(),
					targetHandle:
						constraint.relationships[0].target_column_id.toString() +
						"_target",
					type: "floating",
				};
			});
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
			constraints: edges
				.filter((edge: any) => edge.source === node.id)
				.map((edge: any) => {
					return {
						id: parseInt(edge.id),
						relationships: [
							{
								own_column_id: parseInt(
									edge.sourceHandle.split("_")[0],
								),
								target_column_id: parseInt(
									edge.targetHandle.split("_")[0],
								),
							},
						],
						target_table_id: parseInt(edge.target),
						type: 0,
					};
				}),
		};
	});

	return {
		tables,
		version: 1,
	};
}
