import { ReactFlowInstance } from "@xyflow/react";
import Constraint from "../type/contraint";

export function getNewId(): number {
	return Math.floor(Math.random() * 9000000000 + 1000000000);
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

export function removeForeignKey(
	originTable: any,
	constraintId: number,
	reactflow: ReactFlowInstance,
) {
	const contraint = originTable.constraints.find(
		(constraint: any) => constraint.id === constraintId,
	) as Constraint;

	// Remove edges
	for (const relationship of contraint.relationships) {
		reactflow.deleteElements({
			edges: [{ id: relationship.id.toString() }],
		});
	}

	const updatedConstraints = originTable.constraints.filter(
		(constraint: any) => constraint.id !== constraintId,
	);

	originTable.constraints = updatedConstraints;
	reactflow.updateNode(originTable.id, { data: originTable });
}

export function removeRelationship(
	originTable: any,
	constraintId: number,
	relationshipId: number,
	reactflow: ReactFlowInstance,
) {
	const updatedConstraints = originTable.constraints.map(
		(constraint: any) => {
			if (constraint.id === constraintId) {
				constraint.relationships = constraint.relationships.filter(
					(relationship: any) => relationship.id !== relationshipId,
				);
			}
			return constraint;
		},
	);
	originTable.constraints = updatedConstraints;
	reactflow.updateNode(originTable.id, { data: originTable });
	reactflow.deleteElements({ edges: [{ id: relationshipId.toString() }] });
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
