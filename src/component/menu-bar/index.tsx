import * as Menubar from "@radix-ui/react-menubar";

import "./styles.css";
import { crateJsonByER, loadERFromJSON } from "../../util/load-util";
import { useReactFlow } from "@xyflow/react";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

export default function MenuBar() {
	const [originalFileName, setOriginalFileName] = useState<string>("");

	const reactFlow = useReactFlow();

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
		const fileJson = crateJsonByER(
			reactFlow.getNodes(),
			reactFlow.getEdges(),
		);
		const blob = new Blob([JSON.stringify(fileJson)], {
			type: "application/json",
		});
		saveAs(blob, originalFileName || "er.schemer");
	};

	return (
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
						<Menubar.Item className="MenubarItem">
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
						<Menubar.Item className="MenubarItem">
							Save as
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
						<Menubar.Item className="MenubarItem">
							Websiter
						</Menubar.Item>
						<Menubar.Item className="MenubarItem">
							Github
						</Menubar.Item>
						<Menubar.Item className="MenubarItem">
							About
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>
		</Menubar.Root>
	);
}
