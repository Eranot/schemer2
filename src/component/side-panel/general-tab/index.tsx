import * as Form from "@radix-ui/react-form";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, PlusIcon, DotsVerticalIcon } from "@radix-ui/react-icons";

import { ReactFlowInstance, useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import {
	getNewId,
	moveColumn,
	removeColumn,
	removeTable,
} from "../../../util/table-util";

import "./style.css";
import { useTable } from "../../../context/table-context";

const GeneralTab = () => {
	const { selectedTable } = useTable();

	const reactFlow = useReactFlow();
	const [name, setName] = useState(selectedTable?.name || "");
	const [columns, setColumns] = useState(selectedTable?.columns || []);

	useEffect(() => {
		setName(selectedTable?.name || "");
		setColumns(selectedTable?.columns || []);
	}, [selectedTable]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "C" && e.ctrlKey && e.shiftKey) {
				createNewColumn();
				setTimeout(() => {
					const lastColumn = document.querySelector(
						".ColumnContainer:last-child .Input",
					);
					if (lastColumn) {
						(lastColumn as any).focus();
						(lastColumn as any).setSelectionRange(
							0,
							(lastColumn as any).value.length,
						);
					}
				}, 50);

				e.preventDefault();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [columns]);

	const handleChange = (e: any) => {
		if (!selectedTable) return;
		const updatedName = e.target.value;
		setName(updatedName);
		selectedTable.name = updatedName;
		reactFlow.updateNode(selectedTable.id.toString(), {
			data: selectedTable,
		});
	};

	const createNewColumn = () => {
		if (!selectedTable) return;

		const newColumn = {
			id: getNewId(),
			name: "new_col",
			type: "varchar",
			is_primary_key: false,
			is_not_null: false,
			is_unique: false,
			is_auto_increment: false,
		};
		setColumns([...columns, newColumn]);
		selectedTable.columns = [...selectedTable.columns, newColumn];
		reactFlow.updateNode(selectedTable.id.toString(), {
			data: selectedTable,
		});
	};

	return (
		<div className="TabContainer">
			<Form.Root onSubmit={(e) => e.preventDefault()}>
				<div className="TabTitle">
					<div className="FormField NameField">
						<label className="FormLabel">Name</label>
						<input
							className="Input"
							value={name}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="TableVerticalDos">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild>
								<button
									className="IconButton"
									aria-label="Options"
								>
									<DotsVerticalIcon className="DotsIcon" />
								</button>
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
											removeTable(
												selectedTable!.id.toString(),
												reactFlow,
											)
										}
									>
										Remove table
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					</div>
				</div>

				<div className="ColumnsTitleContainer">
					<div style={{ flexGrow: 1 }}>Columns</div>
					<button className="Button" onClick={createNewColumn}>
						<PlusIcon style={{ width: 26, height: 26 }} />
					</button>
				</div>
				{columns &&
					columns.map((column: any, index: number) => (
						<Column
							key={column.id}
							selectedTable={selectedTable}
							column={column}
							setColumns={setColumns}
							showLabels={index === 0}
						/>
					))}
			</Form.Root>
		</div>
	);
};

const Column = ({ selectedTable, column, setColumns, showLabels }: any) => {
	const reactFlow: ReactFlowInstance = useReactFlow();

	const [name, setName] = useState(column?.name || "");
	const [type, setType] = useState(column?.type || "");
	const [isPrimaryKey, setIsPrimaryKey] = useState(
		column?.is_primary_key || false,
	);
	const [isNotNull, setIsNotNull] = useState(column?.is_not_null || false);
	const [isUnique, setIsUnique] = useState(column?.is_unique || false);
	const [isAutoIncrement, setIsAutoIncrement] = useState(
		column?.is_auto_increment || false,
	);

	const handleChangeName = (e: any) => {
		const updatedValue = e.target.value;
		setName(updatedValue);
		column.name = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const handleChangeType = (e: any) => {
		const updatedValue = e.target.value;
		setType(updatedValue);
		column.type = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const handleChangeIsPrimaryKey = (value: boolean) => {
		const updatedValue = value;
		setIsPrimaryKey(updatedValue);
		column.is_primary_key = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const handleChangeIsNotNull = (value: boolean) => {
		const updatedValue = value;
		setIsNotNull(updatedValue);
		column.is_not_null = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const handleChangeIsUnique = (value: boolean) => {
		const updatedValue = value;
		setIsUnique(updatedValue);
		column.is_unique = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const handleChangeIsAutoIncrement = (value: boolean) => {
		const updatedValue = value;
		setIsAutoIncrement(updatedValue);
		column.is_auto_increment = updatedValue;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const onRemoveColumn = (
		selectedTable: any,
		columnId: number,
		reactFlow: any,
	) => {
		removeColumn(selectedTable, columnId, reactFlow);
		setColumns(selectedTable.columns);
	};

	const onMoveUpColumn = (
		selectedTable: any,
		columnId: number,
		reactFlow: any,
	) => {
		moveColumn(selectedTable, columnId, -1, reactFlow);
		setColumns(selectedTable.columns);
	};

	const onMoveDownColumn = (
		selectedTable: any,
		columnId: number,
		reactFlow: any,
	) => {
		moveColumn(selectedTable, columnId, 1, reactFlow);
		setColumns(selectedTable.columns);
	};

	return (
		<div className="ColumnContainer" key={column.id}>
			<div className="FormField Expandable">
				{showLabels && <label className="FormLabel">Name</label>}
				<input
					value={name}
					onChange={handleChangeName}
					className="Input"
					required
					onKeyDown={(e) => {
						if (e.key === "ArrowUp" && e.ctrlKey) {
							e.stopPropagation();
							onMoveUpColumn(selectedTable, column.id, reactFlow);
						} else if (e.key === "ArrowDown" && e.ctrlKey) {
							e.stopPropagation();
							onMoveDownColumn(
								selectedTable,
								column.id,
								reactFlow,
							);
						} else if (e.key === "Delete" && e.ctrlKey) {
							e.stopPropagation();
							onRemoveColumn(selectedTable, column.id, reactFlow);
						}
					}}
				/>
			</div>
			<div className="FormField">
				{showLabels && <label className="FormLabel">Type</label>}
				<select
					className="Input Select"
					onChange={handleChangeType}
					defaultValue={type}
					required
				>
					<option value="int">int</option>
					<option value="float">float</option>
					<option value="bool">bool</option>
					<option value="varchar">varchar</option>
					<option value="longtext">longtext</option>
					<option value="date">date</option>
					<option value="datetime">datetime</option>
					<option value="json">json</option>
					<option value="enum">enum</option>
				</select>
			</div>
			<div className="FormField">
				{showLabels && <label className="FormLabel">PK</label>}
				<Checkbox.Root
					className="CheckboxRoot"
					checked={isPrimaryKey}
					onCheckedChange={handleChangeIsPrimaryKey}
				>
					<Checkbox.Indicator className="CheckboxIndicator">
						<CheckIcon className="CheckIcon" />
					</Checkbox.Indicator>
				</Checkbox.Root>
			</div>
			<div className="FormField">
				{showLabels && <label className="FormLabel">NN</label>}
				<Checkbox.Root
					className="CheckboxRoot"
					checked={isNotNull}
					onCheckedChange={handleChangeIsNotNull}
				>
					<Checkbox.Indicator className="CheckboxIndicator">
						<CheckIcon className="CheckIcon" />
					</Checkbox.Indicator>
				</Checkbox.Root>
			</div>
			<div className="FormField">
				{showLabels && <label className="FormLabel">UQ</label>}
				<Checkbox.Root
					className="CheckboxRoot"
					checked={isUnique}
					onCheckedChange={handleChangeIsUnique}
				>
					<Checkbox.Indicator className="CheckboxIndicator">
						<CheckIcon className="CheckIcon" />
					</Checkbox.Indicator>
				</Checkbox.Root>
			</div>
			<div className="FormField">
				{showLabels && <label className="FormLabel">AI</label>}
				<Checkbox.Root
					className="CheckboxRoot"
					checked={isAutoIncrement}
					onCheckedChange={handleChangeIsAutoIncrement}
				>
					<Checkbox.Indicator className="CheckboxIndicator">
						<CheckIcon className="CheckIcon" />
					</Checkbox.Indicator>
				</Checkbox.Root>
			</div>

			<div className="FormField">
				{showLabels && (
					<label className="FormLabel">&nbsp;&nbsp;</label>
				)}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button className="IconButton" aria-label="Options">
							<DotsVerticalIcon className="DotsIcon" />
						</button>
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
									onRemoveColumn(
										selectedTable,
										column.id,
										reactFlow,
									)
								}
							>
								Remove
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className="DropdownMenuItem"
								onClick={() =>
									onMoveUpColumn(
										selectedTable,
										column.id,
										reactFlow,
									)
								}
							>
								Move up
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className="DropdownMenuItem"
								onClick={() =>
									onMoveDownColumn(
										selectedTable,
										column.id,
										reactFlow,
									)
								}
							>
								Move down
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
		</div>
	);
};

export default GeneralTab;
