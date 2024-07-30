import { ReactFlowInstance } from "@xyflow/react";

export function getNewId(): string {
	return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
}

export function getDefaultColumns(): any[] {
	return [
		{
			id: getNewId(),
			name: "id",
			type: "int",
			is_primary_key: true,
			is_nullable: false,
		},
	];
}

export function removeColumn(
	originTable: any,
	columnId: number,
	reactflow: ReactFlowInstance,
) {
	const updatedColumns = originTable.columns.filter(
		(column: any) => column.id !== columnId,
	);
	originTable.columns = updatedColumns;
	reactflow.updateNode(originTable.id, { data: originTable });

	// for each table, remove the constraint that references the column
	for (const nodeTable of reactflow.getNodes()) {
		const table: any = nodeTable.data;
		for (const constraint of table.constraints) {
			if (
				table.id === originTable.id ||
				constraint.target_table_id === originTable.id
			) {
				table.constraints = table.constraints.filter((c: any) => {
					return !c.relationships.some(
						(r: any) =>
							r.own_column_id !== columnId ||
							r.target_column_id !== columnId,
					);
				});
			}
			reactflow.updateNode(table.id, { data: table });
		}
	}
}

export function moveColumn(
	originTable: any,
	columnId: number,
	offset: number,
	reacflow: ReactFlowInstance,
) {
	const updatedColumns = [...originTable.columns];
	const index = updatedColumns.findIndex(
		(column: any) => column.id === columnId,
	);
	const newIndex = index + offset;
	if (newIndex < 0 || newIndex >= updatedColumns.length) {
		return;
	}
	[updatedColumns[index], updatedColumns[newIndex]] = [
		updatedColumns[newIndex],
		updatedColumns[index],
	];
	originTable.columns = updatedColumns;
	reacflow.updateNode(originTable.id, { data: originTable });
}

export function removeTable(tableId: string, reactflow: ReactFlowInstance) {
	const tableNode: any = reactflow.getNode(tableId);
	reactflow.deleteElements({
		nodes: [tableNode],
	});

	// for each table, remove the constraint that references the table
	for (const nodeTable of reactflow.getNodes()) {
		const table: any = nodeTable.data;
		for (const constraint of table.constraints) {
			if (constraint.target_table_id === tableId) {
				table.constraints = table.constraints.filter((c: any) => {
					return c.target_table_id !== tableId;
				});
			}
			reactflow.updateNode(table.id, { data: table });
		}
	}
}
