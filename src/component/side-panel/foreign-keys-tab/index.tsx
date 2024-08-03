import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PlusIcon, DotsVerticalIcon } from "@radix-ui/react-icons";

import { ReactFlowInstance, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";
import {
	getNewId,
	removeForeignKey,
	removeRelationship,
} from "../../../util/table-util";

import "./style.css";
import { useTable } from "../../../context/table-context";
import ConstraintTypeEnum from "../../../enum/constraint-type-enum";
import Constraint from "../../../type/contraint";
import { useEditor } from "../../../context/editor-context";

const ForeignKeysTab = () => {
	const { selectedTable } = useTable();

	const reactFlow = useReactFlow();
	const [foreignKeys, setForeignKeys] = useState<Constraint[]>([]);

	useEffect(() => {
		setForeignKeys(
			selectedTable?.constraints?.filter(
				(c: Constraint) => c.type == ConstraintTypeEnum.FOREIGN_KEY,
			) || [],
		);
	}, [selectedTable, selectedTable?.constraints]);

	const createNewForeignKey = () => {
		if (!selectedTable) return;

		const newConstraint: Constraint = {
			id: getNewId(),
			type: ConstraintTypeEnum.FOREIGN_KEY,
			target_table_id: 0,
			relationships: [],
		};

		setForeignKeys([...foreignKeys, newConstraint]);
		selectedTable.constraints = [
			...selectedTable.constraints,
			newConstraint,
		];
		reactFlow.updateNode(selectedTable!.id.toString(), {
			data: selectedTable,
		});
	};

	return (
		<div className="TabContainer">
			<div className="ForeignKeysTitleContainer">
				<div style={{ flexGrow: 1 }}>Foreign keys</div>
				<button className="Button" onClick={createNewForeignKey}>
					<PlusIcon style={{ width: 26, height: 26 }} />
				</button>
			</div>
			{foreignKeys &&
				foreignKeys.map((foreignKey: any) => (
					<ForeignKeyContainer
						key={foreignKey.id}
						selectedTable={selectedTable}
						foreignKey={foreignKey}
						setForeignKeys={setForeignKeys}
					/>
				))}
		</div>
	);
};

const ForeignKeyContainer = ({ selectedTable, foreignKey }: any) => {
	const reactFlow: ReactFlowInstance = useReactFlow();
	const { nodes } = useEditor();
	const [targetTableId, setTargetTableId] = useState(
		foreignKey?.target_table_id || "",
	);

	const handleChangeTargetTable = (e: any) => {
		const updatedValue = e.target.value;
		setTargetTableId(updatedValue);
		foreignKey.target_table_id = updatedValue;

		// for each relationship, find the edge and remove it
		for (const relationship of foreignKey.relationships) {
			reactFlow.deleteElements({ edges: [{ id: relationship.id }] });
		}

		foreignKey.relationships = [];
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const createNewRelationship = () => {
		const newRelationship = {
			id: getNewId(),
			own_column_id: null,
			target_column_id: null,
		};

		foreignKey.relationships = [
			...foreignKey.relationships,
			newRelationship,
		];
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const onRemoveRelationship = (relationshipId: number) => {
		removeRelationship(
			selectedTable,
			foreignKey.id,
			relationshipId,
			reactFlow,
		);
	};

	const possibleTargetTables = useMemo(() => {
		return nodes
			.filter((node) => node.id != selectedTable.id)
			.map((node) => node.data);
	}, [selectedTable, nodes]);

	const targetTable = useMemo(() => {
		return nodes.find((node) => node.data.id == targetTableId)?.data;
	}, [targetTableId]);

	return (
		<div className="ForeignKeyContainer" key={foreignKey.id}>
			<div className="RelationshipContainer">
				<div className="FormField Expandable">
					<label className="FormLabel">Target table</label>
					<select
						className="Input Select"
						onChange={handleChangeTargetTable}
						defaultValue={targetTableId}
						required
					>
						<option key={0} value="">
							Select a table
						</option>
						{possibleTargetTables &&
							possibleTargetTables.map((table: any) => (
								<option key={table.id} value={table.id}>
									{table.name}
								</option>
							))}
					</select>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<div>
							<div className="FormLabel">&nbsp;&nbsp;</div>
							<button
								className="IconButton FlexEmd"
								aria-label="Options"
							>
								<DotsVerticalIcon className="DotsIcon" />
							</button>
						</div>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className="DropdownMenuContent"
							sideOffset={5}
							align="end"
						>
							<DropdownMenu.Item
								className="DropdownMenuItem"
								onClick={() =>
									removeForeignKey(
										selectedTable,
										foreignKey.id,
										reactFlow,
									)
								}
							>
								Remove
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>

			<div className="RelationshipsTitleContainer">
				<div style={{ flexGrow: 1 }}>Relationships</div>
				<button className="Button" onClick={createNewRelationship}>
					<PlusIcon style={{ width: 26, height: 26 }} />
				</button>
			</div>
			{foreignKey.relationships &&
				foreignKey.relationships.map(
					(relationship: any, index: number) => (
						<RelationshipContainer
							key={"relationship_" + index}
							relationship={relationship}
							selectedTable={selectedTable}
							targetTable={targetTable}
							foreignKey={foreignKey}
							onRemoveRelationship={onRemoveRelationship}
						/>
					),
				)}
		</div>
	);
};

const RelationshipContainer = ({
	relationship,
	selectedTable,
	foreignKey,
	targetTable,
	onRemoveRelationship,
}: any) => {
	const reactFlow: ReactFlowInstance = useReactFlow();

	const [ownColumnId, setOwnColumnId] = useState(relationship?.own_column_id);
	const [targetColumnId, setTargetColumnId] = useState(
		relationship?.target_column_id || "",
	);

	const handleChangeOwnColumn = (e: any) => {
		const updatedValue = e.target.value;
		setOwnColumnId(updatedValue);
		relationship.own_column_id = updatedValue;

		// Chage the target column to null if the type is different
		if (
			selectedTable.columns.find(
				(column: any) => column.id == updatedValue,
			)?.type !=
			targetTable.columns.find(
				(column: any) => column.id == relationship.target_column_id,
			)?.type
		) {
			relationship.target_column_id = null;
			setTargetColumnId(null);
		}

		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
		reactFlow.updateEdge(getEdgeId(), {
			sourceHandle: updatedValue + "_source",
			targetHandle: relationship.target_column_id + "_target",
		});
	};

	const handleTargetColumn = (e: any) => {
		const updatedValue = e.target.value;
		setTargetColumnId(updatedValue);
		relationship.target_column_id = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
		const edgeId = getEdgeId();
		const edge = reactFlow.getEdge(edgeId);

		if (edge == null) {
			const newEdge = {
				id: relationship.id.toString(),
				source: selectedTable.id.toString(),
				sourceHandle: ownColumnId + "_source",
				target: targetTable.id.toString(),
				targetHandle: updatedValue + "_target",
				type: "floating",
			};
			reactFlow.addEdges([newEdge]);
		} else {
			reactFlow.updateEdge(edgeId, {
				sourceHandle: ownColumnId + "_source",
				targetHandle: updatedValue + "_target",
			});
		}
	};

	const getEdgeId = () => {
		return (
			foreignKey.id + "_" + foreignKey.relationships.indexOf(relationship)
		);
	};

	const ownColumn = useMemo(() => {
		return selectedTable?.columns.find(
			(column: any) => column.id == ownColumnId,
		);
	}, [ownColumnId, selectedTable]);

	const possibleTargetColumns = useMemo(() => {
		return targetTable.columns.filter(
			(column: any) => column.type == ownColumn?.type,
		);
	}, [ownColumnId, targetTable]);

	return (
		<div className="RelationshipContainer">
			<div className="FormField Expandable">
				<label className="FormLabel">Own column</label>
				<select
					className="Input Select"
					onChange={handleChangeOwnColumn}
					defaultValue={ownColumnId}
					required
				>
					<option key={0} value="">
						Select a column
					</option>
					{selectedTable.columns &&
						selectedTable.columns.map((column: any) => (
							<option key={column.id} value={column.id}>
								{column.name}
							</option>
						))}
				</select>
			</div>
			<div className="FormField Expandable">
				<label className="FormLabel">Target column</label>
				<select
					className="Input Select"
					onChange={handleTargetColumn}
					defaultValue={targetColumnId}
					required
				>
					<option key={0} value="">
						Select a column
					</option>
					{possibleTargetColumns &&
						possibleTargetColumns.map((column: any) => (
							<option key={column.id} value={column.id}>
								{column.name}
							</option>
						))}
				</select>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<div>
						<div className="FormLabel">&nbsp;&nbsp;</div>
						<button
							className="IconButton FlexEmd"
							aria-label="Options"
						>
							<DotsVerticalIcon className="DotsIcon" />
						</button>
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						className="DropdownMenuContent"
						sideOffset={5}
						align="end"
					>
						<DropdownMenu.Item
							className="DropdownMenuItem"
							onClick={() =>
								onRemoveRelationship(relationship.id)
							}
						>
							Remove
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	);
};

export default ForeignKeysTab;
