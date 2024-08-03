import * as RadixToolbar from "@radix-ui/react-toolbar";
import createTableIcon from "../../assets/create_table_icon_normal.png";
import oneToManyIcon from "../../assets/one_to_many_icon_normal.png";
import manyToManyIcon from "../../assets/many_to_many_icon_normal.png";
import cursorIcon from "../../assets/cursor_icon_normal.png";
import { useToolbar } from "../../context/toolbar-context";
import ToolEnum from "../../enum/tool-enum";
import "./styles.css";

const Toolbar = () => {
	const { currentTool, setCurrentTool } = useToolbar();

	return (
		<RadixToolbar.Root
			className="ToolbarRoot"
			aria-label="Formatting options"
			orientation="vertical"
		>
			<RadixToolbar.ToggleGroup
				className="ToolbarToggleGroup"
				type="single"
				aria-label="Text formatting"
				orientation="vertical"
				value={currentTool}
			>
				<RadixToolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.SELECT}
					aria-label="Select"
					onClick={() => {
						setCurrentTool(ToolEnum.SELECT);
					}}
				>
					<img src={cursorIcon} />
				</RadixToolbar.ToggleItem>

				<RadixToolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.CREATE_TABLE}
					aria-label="Create table"
					onClick={() => {
						setCurrentTool(ToolEnum.CREATE_TABLE);
					}}
				>
					<img src={createTableIcon} />
				</RadixToolbar.ToggleItem>

				<RadixToolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.ONE_TO_MANY}
					aria-label="One to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.ONE_TO_MANY);
					}}
				>
					<img src={oneToManyIcon} />
				</RadixToolbar.ToggleItem>

				<RadixToolbar.ToggleItem
					className="ToolbarToggleItem"
					value={ToolEnum.MANY_TO_MANY}
					aria-label="many to many connection"
					onClick={() => {
						setCurrentTool(ToolEnum.MANY_TO_MANY);
					}}
				>
					<img src={manyToManyIcon} />
				</RadixToolbar.ToggleItem>
			</RadixToolbar.ToggleGroup>
		</RadixToolbar.Root>
	);
};

export default Toolbar;
