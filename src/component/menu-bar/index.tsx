import * as Menubar from "@radix-ui/react-menubar";
import { createJsonByER, loadERFromJSON } from "../../util/load-util";
import { Node, useReactFlow } from "@xyflow/react";
import { saveAs } from "file-saver";
import { useEffect, useState, useCallback } from "react";
import { useEditor } from "../../context/editor-context";
import { useTable } from "../../context/table-context";
import NewFileWarningDialog from "./new-file-warning-dialog";
import FkNamingDialog from "./fk-naming-dialog";
import Table from "../../type/table";

import "./styles.css";
import FkNamingEnum from "../../enum/fk-naming-enum";

export default function MenuBar() {
	const [originalFileName, setOriginalFileName] = useState<string>("");
	const [isNewFileDialogOpen, setIsNewFileDialogOpen] =
		useState<boolean>(false);
	const [isFkNamingDialogOpen, setIsFkNamingDialogOpen] =
		useState<boolean>(false);
	const [fkNamingFormat, setFkNamingFormat] = useState<FkNamingEnum>(
		(localStorage.getItem("fkNamingFormat") as FkNamingEnum) ||
			FkNamingEnum.TABLE_PK,
	);

	const editor = useEditor();
	const reactFlow = useReactFlow();
	const { setSelectedTable } = useTable();

	const onNewFile = () => {
		setIsNewFileDialogOpen(true);
	};

	const startNewFile = () => {
		editor.setEdges([]);
		editor.setNodes([]);
		setSelectedTable(null);
		setIsNewFileDialogOpen(false);
	};

	const onOpenFile = useCallback(() => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".schemer,.schemer.json";

		input.onchange = async (event: Event) => {
			const target = event.target as HTMLInputElement;
			const file = target.files?.[0];
			if (file) {
				const text = await file.text();
				const json = JSON.parse(text);
				const { initialNodes, initialEdges } = loadERFromJSON(json);

				reactFlow.setNodes(initialNodes);
				reactFlow.setEdges(initialEdges);
				setOriginalFileName(file.name);
			}
		};

		input.click();
	}, [reactFlow]);

	const onSaveFile = useCallback(() => {
		const fileJson = createJsonByER(reactFlow.getNodes() as Node<Table>[]);
		const json = JSON.stringify(fileJson, null, 4);
		const blob = new Blob([json], {
			type: "application/json",
		});
		saveAs(blob, originalFileName || "er.schemer.json");
	}, [reactFlow, originalFileName]);

	useEffect(() => {
		// ctrl s to save
		const handleCtrlS = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault();
				onSaveFile();
			}
		};
		// ctrl o to open
		const handleCtrlO = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "o") {
				event.preventDefault();
				onOpenFile();
			}
		};
		window.addEventListener("keydown", handleCtrlS);
		window.addEventListener("keydown", handleCtrlO);

		return () => {
			window.removeEventListener("keydown", handleCtrlS);
			window.removeEventListener("keydown", handleCtrlO);
		};
	}, [onOpenFile, onSaveFile]);

	const onClickWebsite = () => {
		window.open("https://schemer.gg");
	};

	const onClickGithub = () => {
		window.open("https://github.com/Eranot/schemer2");
	};

	const onClickFkNaming = () => {
		setIsFkNamingDialogOpen(true);
	};

	const onSaveFkNamingFormat = (format: FkNamingEnum) => {
		setFkNamingFormat(format);
		localStorage.setItem("fkNamingFormat", format);
	};

	return (
		<>
			<Menubar.Root className="MenubarRoot">
				<Menubar.Menu>
					<Menubar.Trigger className="MenubarTrigger">
						File
					</Menubar.Trigger>
					<Menubar.Portal>
						<Menubar.Content
							className="MenubarContent"
							align="start"
							sideOffset={5}
							alignOffset={-3}
						>
							<Menubar.Item
								className="MenubarItem"
								onClick={onNewFile}
							>
								New File
							</Menubar.Item>
							<Menubar.Item
								className="MenubarItem"
								onClick={onOpenFile}
							>
								Open file
							</Menubar.Item>
							<Menubar.Item
								className="MenubarItem"
								onClick={onSaveFile}
							>
								Save
							</Menubar.Item>
						</Menubar.Content>
					</Menubar.Portal>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger className="MenubarTrigger">
						Config
					</Menubar.Trigger>
					<Menubar.Portal>
						<Menubar.Content
							className="MenubarContent"
							align="start"
							sideOffset={5}
							alignOffset={-3}
						>
							<Menubar.Item
								className="MenubarItem"
								onClick={onClickFkNaming}
							>
								FK naming
							</Menubar.Item>
						</Menubar.Content>
					</Menubar.Portal>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger className="MenubarTrigger">
						Help
					</Menubar.Trigger>
					<Menubar.Portal>
						<Menubar.Content
							className="MenubarContent"
							align="start"
							sideOffset={5}
							alignOffset={-3}
						>
							<Menubar.Item
								className="MenubarItem"
								onClick={onClickWebsite}
							>
								Website
							</Menubar.Item>
							<Menubar.Item
								className="MenubarItem"
								onClick={onClickGithub}
							>
								Github
							</Menubar.Item>
						</Menubar.Content>
					</Menubar.Portal>
				</Menubar.Menu>
			</Menubar.Root>
			<NewFileWarningDialog
				open={isNewFileDialogOpen}
				onConfirm={startNewFile}
				onCancel={() => setIsNewFileDialogOpen(false)}
			/>
			<FkNamingDialog
				open={isFkNamingDialogOpen}
				onClose={() => setIsFkNamingDialogOpen(false)}
				onSave={onSaveFkNamingFormat}
				currentFormat={fkNamingFormat}
			/>
		</>
	);
}
