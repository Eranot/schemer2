import * as Toolbar from "@radix-ui/react-toolbar";
import createTableIcon from "../../assets/create_table_icon_normal.png";
import oneToManyIcon from "../../assets/one_to_many_icon_normal.png";
import manyToManyIcon from "../../assets/many_to_many_icon_normal.png";
import cursorIcon from "../../assets/cursor_icon_normal.png";
import { useToolbar } from "../../context/toolbar-context";
import ToolEnum from "../../enum/tool-enum";
import "./styles.css";

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
					<img src={cursorIcon} />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.CREATE_TABLE}
					aria-label="Create table"
					onClick={() => {
						setCurrentTool(ToolEnum.CREATE_TABLE);
					}}
				>
					<img src={createTableIcon} />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.ONE_TO_MANY}
					aria-label="One to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.ONE_TO_MANY);
					}}
				>
					<img src={oneToManyIcon} />
				</Toolbar.ToggleItem>

				<Toolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.MANY_TO_MANY}
					aria-label="many to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.MANY_TO_MANY);
					}}
				>
					<img src={manyToManyIcon} />
				</Toolbar.ToggleItem>
			</Toolbar.ToggleGroup>
		</Toolbar.Root>
	);
};

export default ToolbarDemo;
