import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import Constraint from "../type/contraint";
import Table from "../type/table";
import Column from "../type/column";
import ConstraintTypeEnum from "../enum/constraint-type-enum";
import ConstraintRelationship from "../type/constraint-relationship";
import FkNamingEnum from "../enum/fk-naming-enum";

export function getNewId(): number {
	return Math.floor(Math.random() * 9000000000 + 1000000000);
}

export function getDefaultColumns(): Column[] {
	return [
		{
			id: getNewId(),
			name: "id",
			type: "int",
			is_auto_increment: true,
			is_primary_key: true,
			is_not_null: false,
			is_unique: false,
		},
	];
}

export function createNewTable(
	position: { x: number; y: number },
	reactFlow: ReactFlowInstance,
) {
	const id = getNewId();
	const newNode: Node<Table> = {
		id: id.toString(),
		type: "table",
		position,
		data: {
			id: id,
			name: "new_table",
			position,
			columns: getDefaultColumns(),
			constraints: [],
		},
	};
	reactFlow.addNodes([newNode]);
	return newNode;
}

export function createOneToManyRelationship(
	sourceNode: Node<Table>,
	targetNode: Node<Table>,
	reactFlow: ReactFlowInstance,
) {
	const targetPrimaryKeys = targetNode.data.columns.filter(
		(column: any) => column.is_primary_key,
	);

	const newConstraint: Constraint = {
		id: getNewId(),
		type: ConstraintTypeEnum.FOREIGN_KEY,
		relationships: [],
		target_table_id: parseInt(targetNode.id),
	};

	for (const primaryKey of targetPrimaryKeys) {
		const newColumn: Column = {
			id: getNewId(),
			name: getFkName(targetNode.data.name, primaryKey.name),
			type: primaryKey.type,
			is_primary_key: false,
			is_not_null: true,
			is_unique: false,
			is_auto_increment: false,
		};
		sourceNode.data.columns.push(newColumn);

		const newRelationship: ConstraintRelationship = {
			id: getNewId(),
			own_column_id: newColumn.id,
			target_column_id: primaryKey.id,
		};

		newConstraint.relationships.push(newRelationship);
		const newEdge: Edge = {
			id: newRelationship.id.toString(),
			source: sourceNode.id.toString(),
			sourceHandle: newColumn.id + "_source",
			target: targetNode.id.toString(),
			targetHandle: primaryKey.id + "_target",
			type: "floating",
		};

		reactFlow.addEdges([newEdge]);
	}

	sourceNode.data.constraints = [
		...sourceNode.data.constraints,
		newConstraint,
	];
	reactFlow.updateNode(sourceNode.id, { data: sourceNode.data });
}

export function createManyToManyRelationship(
	sourceNode: Node<Table>,
	targetNode: Node<Table>,
	reactFlow: ReactFlowInstance,
) {
	const middlePosition = {
		x: (sourceNode.position.x + targetNode.position.x) / 2,
		y: (sourceNode.position.y + targetNode.position.y) / 2,
	};

	const intermediateId = getNewId();
	const newIntermediateTable: Node<Table> = {
		id: intermediateId.toString(),
		type: "table",
		position: middlePosition,
		origin: [0.5, 0.0],
		data: {
			id: intermediateId,
			name: sourceNode.data.name + "_" + targetNode.data.name,
			position: middlePosition,
			columns: [],
			constraints: [],
		},
	};
	reactFlow.addNodes([newIntermediateTable]);

	// add the constraints of the source node
	const sourceConstraint: Constraint = {
		id: getNewId(),
		relationships: [],
		target_table_id: parseInt(sourceNode.id),
		type: ConstraintTypeEnum.FOREIGN_KEY,
	};

	const sourcePrimaryKeys: Column[] = sourceNode.data.columns.filter(
		(column: any) => column.is_primary_key,
	);
	for (const primaryKey of sourcePrimaryKeys) {
		const newColumn: Column = {
			id: getNewId(),
			name: getFkName(sourceNode.data.name, primaryKey.name),
			type: primaryKey.type,
			is_primary_key: true,
			is_not_null: false,
			is_unique: false,
			is_auto_increment: false,
		};
		newIntermediateTable.data.columns.push(newColumn);

		const newRelationship: ConstraintRelationship = {
			id: getNewId(),
			own_column_id: newColumn.id,
			target_column_id: primaryKey.id,
		};
		sourceConstraint.relationships.push(newRelationship);

		const newEdge: Edge = {
			id: newRelationship.id.toString(),
			source: newIntermediateTable.id.toString(),
			sourceHandle: newColumn.id + "_source",
			target: sourceNode.id.toString(),
			targetHandle: primaryKey.id + "_target",
			type: "floating",
		};

		reactFlow.addEdges([newEdge]);
	}

	newIntermediateTable.data.constraints = [
		...newIntermediateTable.data.constraints,
		sourceConstraint,
	];
	reactFlow.updateNode(newIntermediateTable.id, {
		data: newIntermediateTable.data,
	});

	// add the constraints of the target node
	const targetConstraint: Constraint = {
		id: getNewId(),
		relationships: [],
		target_table_id: parseInt(targetNode.id),
		type: ConstraintTypeEnum.FOREIGN_KEY,
	};

	const targetPrimaryKeys: Column[] = targetNode.data.columns.filter(
		(column: any) => column.is_primary_key,
	);
	for (const primaryKey of targetPrimaryKeys) {
		const newColumn: Column = {
			id: getNewId(),
			name: getFkName(targetNode.data.name, primaryKey.name),
			type: primaryKey.type,
			is_primary_key: true,
			is_not_null: false,
			is_unique: false,
			is_auto_increment: false,
		};
		newIntermediateTable.data.columns.push(newColumn);

		const newRelationship: ConstraintRelationship = {
			id: getNewId(),
			own_column_id: newColumn.id,
			target_column_id: primaryKey.id,
		};
		targetConstraint.relationships.push(newRelationship);

		const newEdge: Edge = {
			id: newRelationship.id.toString(),
			source: newIntermediateTable.id.toString(),
			sourceHandle: newColumn.id + "_source",
			target: targetNode.id.toString(),
			targetHandle: primaryKey.id + "_target",
			type: "floating",
		};

		reactFlow.addEdges([newEdge]);
	}

	newIntermediateTable.data.constraints = [
		...newIntermediateTable.data.constraints,
		targetConstraint,
	];
	reactFlow.updateNode(newIntermediateTable.id, {
		data: newIntermediateTable.data,
	});
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

export function removeTable(tableId: number, reactflow: ReactFlowInstance) {
	const tableNode: Node | undefined = reactflow.getNode(tableId.toString());
	if (!tableNode) {
		return;
	}

	reactflow.deleteElements({
		nodes: [tableNode],
	});

	// for each table, remove the constraint that references the table
	for (const nodeTable of reactflow.getNodes()) {
		const table: Table = nodeTable.data as Table;
		for (const constraint of table.constraints) {
			if (constraint.target_table_id === tableId) {
				table.constraints = table.constraints.filter((c: any) => {
					return c.target_table_id !== tableId;
				});
			}
			reactflow.updateNode(table.id.toString(), { data: table });
		}
	}
}

function getFkName(targetTableName: string, targetPkName: string): string {
	const fkFormat =
		localStorage.getItem("fkNamingFormat") || FkNamingEnum.TABLE_PK;

	if (fkFormat === FkNamingEnum.PK_TABLE) {
		return `${targetPkName}_${targetTableName}`;
	}

	return `${targetTableName}_${targetPkName}`;
}
