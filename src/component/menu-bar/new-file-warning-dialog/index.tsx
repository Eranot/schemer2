import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "./styles.css";

const NewFileWarningDialog = ({ open, onConfirm, onCancel }: any) => (
	<AlertDialog.Root open={open}>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="AlertDialogOverlay" />
			<AlertDialog.Content className="AlertDialogContent">
				<AlertDialog.Title className="AlertDialogTitle">
					Are you sure?
				</AlertDialog.Title>
				<AlertDialog.Description className="AlertDialogDescription">
					You will lose all unsaved changes on the current file
				</AlertDialog.Description>
				<div
					style={{
						display: "flex",
						gap: 25,
						justifyContent: "flex-end",
					}}
				>
					<AlertDialog.Cancel asChild>
						<button
							className="ButtonDialog mauve"
							onClick={onCancel}
						>
							Cancel
						</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button
							className="ButtonDialog red"
							onClick={onConfirm}
						>
							Yes, create new file
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default NewFileWarningDialog;
