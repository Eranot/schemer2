import * as Tabs from "@radix-ui/react-tabs";
import { useTable } from "../../context/table-context";
import { useEffect } from "react";
import GeneralTab from "./general-tab";

import "./style.css";
import ForeignKeysTab from "./foreign-keys-tab";

const SidePanel = () => {
	const { setSelectedTable } = useTable();

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedTable(null);
			}
		};

		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [setSelectedTable]);

	return (
		<div className="SidePanel">
			<Tabs.Root defaultValue="general" orientation="vertical">
				<Tabs.List aria-label="tabs" className="TabsList">
					<Tabs.Trigger className="TabsTrigger" value="general">
						General
					</Tabs.Trigger>
					<Tabs.Trigger className="TabsTrigger" value="foreign_keys">
						Foreign keys
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="general">
					<GeneralTab />
				</Tabs.Content>
				<Tabs.Content value="foreign_keys">
					<ForeignKeysTab />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
};

export default SidePanel;
