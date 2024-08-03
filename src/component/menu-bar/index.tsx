import * as Menubar from "@radix-ui/react-menubar";
import { createJsonByER, loadERFromJSON } from "../../util/load-util";
import { Node, useReactFlow } from "@xyflow/react";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useEditor } from "../../context/editor-context";
import { useTable } from "../../context/table-context";
import NewFileWarningDialog from "./new-file-warning-dialog";
import Table from "../../type/table";

import "./styles.css";

export default function MenuBar() {
	const [originalFileName, setOriginalFileName] = useState<string>("");
	const [isNewFileDialogOpen, setIsNewFileDialogOpen] =
		useState<boolean>(false);

	const editor = useEditor();
	const reactFlow = useReactFlow();
	const { setSelectedTable } = useTable();

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
	}, []);

	const onNewFile = () => {
		setIsNewFileDialogOpen(true);
	};

	const startNewFile = () => {
		editor.setEdges([]);
		editor.setNodes([]);
		setSelectedTable(null);
		setIsNewFileDialogOpen(false);
	};

	const onOpenFile = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".schemer,.schemer.json";

		input.onchange = async (event: any) => {
			const file = event.target.files[0];
			if (file) {
				const text = await file.text();
				const json = JSON.parse(text);
				const { initialNodes, initialEdges }: any =
					loadERFromJSON(json);

				reactFlow.setNodes(initialNodes);
				reactFlow.setEdges(initialEdges);
				setOriginalFileName(file.name);
			}
		};

		input.click();
	};

	const onSaveFile = () => {
		const fileJson = createJsonByER(reactFlow.getNodes() as Node<Table>[]);
		const json = JSON.stringify(fileJson, null, 4);
		const blob = new Blob([json], {
			type: "application/json",
		});
		saveAs(blob, originalFileName || "er.schemer");
	};

	const onClickWebsite = () => {
		window.open("https://schemer.gg");
	};

	const onClickGithub = () => {
		window.open("https://github.com/Eranot/schemer2");
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
		</>
	);
}
