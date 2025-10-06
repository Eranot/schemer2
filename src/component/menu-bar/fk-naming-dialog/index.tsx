import * as Dialog from "@radix-ui/react-dialog";
import "./styles.css";
import FkNamingEnum from "../../../enum/fk-naming-enum";

interface FkNamingDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (format: FkNamingEnum) => void;
	currentFormat: FkNamingEnum;
}

export default function FkNamingDialog({
	open,
	onClose,
	onSave,
	currentFormat,
}: FkNamingDialogProps) {
	const handleFormatChange = (format: FkNamingEnum) => {
		onSave(format);
		onClose();
	};

	return (
		<Dialog.Root open={open} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" />
				<Dialog.Content className="DialogContent">
					<Dialog.Title className="DialogTitle">
						Config foreign key naming format
					</Dialog.Title>
					<Dialog.Description className="DialogDescription">
						Choose the format for the foreign key naming:
					</Dialog.Description>

					<div className="OptionContainer">
						<label className="OptionLabel">
							<input
								type="radio"
								name="fkFormat"
								value={FkNamingEnum.TABLE_PK}
								checked={
									currentFormat === FkNamingEnum.TABLE_PK
								}
								onChange={() =>
									handleFormatChange(FkNamingEnum.TABLE_PK)
								}
								className="RadioInput"
							/>
							<span className="OptionText">
								{"{target_table}_{target_pk}"}
							</span>
							<span className="OptionExample">Ex: user_id</span>
						</label>

						<label className="OptionLabel">
							<input
								type="radio"
								name="fkFormat"
								value={FkNamingEnum.PK_TABLE}
								checked={
									currentFormat === FkNamingEnum.PK_TABLE
								}
								onChange={() =>
									handleFormatChange(FkNamingEnum.PK_TABLE)
								}
								className="RadioInput"
							/>
							<span className="OptionText">
								{"{target_pk}_{target_table}"}
							</span>
							<span className="OptionExample">Ex: id_user</span>
						</label>
					</div>

					<div className="DialogFooter">
						<Dialog.Close asChild>
							<button className="CancelButton">Cancel</button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
