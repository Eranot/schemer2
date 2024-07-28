import * as Menubar from "@radix-ui/react-menubar";

import "./styles.css";

export default function MenuBar() {
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
						<Menubar.Item className="MenubarItem">
							Open file
						</Menubar.Item>
						<Menubar.Item className="MenubarItem">
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
