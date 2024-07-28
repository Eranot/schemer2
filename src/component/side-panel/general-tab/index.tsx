import * as Form from "@radix-ui/react-form";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";

import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { getNewId } from "../../../util/table-util";

import "./style.css";

const GeneralTab = ({ selectedTable }: any) => {
	const reactFlow = useReactFlow();
	const [name, setName] = useState(selectedTable?.name || "");
	const [columns, setColumns] = useState(selectedTable?.columns || "");

	useEffect(() => {
		setName(selectedTable?.name || "");
		setColumns(selectedTable?.columns || "");
	}, [selectedTable]);

	const handleChange = (e: any) => {
		const updatedName = e.target.value;
		setName(updatedName);
		selectedTable.name = updatedName;
		reactFlow.updateNode(selectedTable.id, { data: selectedTable });
	};

	const createNewColumn = () => {
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
		reactFlow.updateNode(selectedTable.id, {
			data: selectedTable,
		});
	};

	return (
		<div className="TabContainer">
			<Form.Root onSubmit={(e) => e.preventDefault()}>
				<div className="FormField">
					<label className="FormLabel">Name</label>
					<input
						className="Input"
						value={name}
						onChange={handleChange}
						required
					/>
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
							showLabels={index === 0}
						/>
					))}
			</Form.Root>
		</div>
	);
};

const Column = ({ selectedTable, column, showLabels }: any) => {
	const reactFlow = useReactFlow();

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

	return (
		<div className="ColumnContainer" key={column.id}>
			<div className="FormField Expandable">
				{showLabels && <label className="FormLabel">Name</label>}
				<input
					value={name}
					onChange={handleChangeName}
					className="Input"
					required
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
		</div>
	);
};

export default GeneralTab;