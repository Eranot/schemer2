import * as Toolbar from "@radix-ui/react-toolbar";
import {
	TableIcon,
	CursorArrowIcon,
	ArrowUpIcon,
	DoubleArrowUpIcon,
} from "@radix-ui/react-icons";
import "./styles.css";
import { useToolbar } from "../../context/toolbar-context";
import ToolEnum from "../../enum/tool-enum";

const ToolbarDemo = () => {
	const { currentTool, setCurrentTool } = useToolbar();

	return (
		<Toolbar.Root
			className="ToolbarRoot"
			aria-label="Formatting options"
			orientation="vertical"
		>
			<Toolbar.ToggleGroup
				className="ToolbarToggleGroup"
				type="single"
				aria-label="Text formatting"
				orientation="vertical"
				value={currentTool}
			>
				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.SELECT}
					aria-label="Select"
					onClick={() => {
						setCurrentTool(ToolEnum.SELECT);
					}}
				>
					<CursorArrowIcon />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.CREATE_TABLE}
					aria-label="Create table"
					onClick={() => {
						setCurrentTool(ToolEnum.CREATE_TABLE);
					}}
				>
					<TableIcon />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.ONE_TO_MANY}
					aria-label="One to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.ONE_TO_MANY);
					}}
				>
					<ArrowUpIcon />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.MANY_TO_MANY}
					aria-label="many to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.MANY_TO_MANY);
					}}
				>
					<DoubleArrowUpIcon />
				</Toolbar.ToggleItem>
			</Toolbar.ToggleGroup>
		</Toolbar.Root>
	);
};

export default ToolbarDemo;
