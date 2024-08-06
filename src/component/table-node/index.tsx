import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo } from "react";
import columnDiamondEmpty from "../../assets/column_diamond_empty.png";
import columnDiamondFull from "../../assets/column_diamond_full.png";
import { useEditor } from "../../context/editor-context";
import "./style.css";

const handleStyle = {
	background: "transparent",
	border: "none",
	borderWidth: 0,
};

function TableNode({ id, data }: any) {
	const updateNodeInternals = useUpdateNodeInternals();
	const { toolSelectedNodeTable } = useEditor();

	const columns = useMemo(() => {
		updateNodeInternals(id);
		return data.columns;
	}, [data.columns]);

	return (
		<div
			className="table-container"
			data-tool-selected={toolSelectedNodeTable?.id === id}
		>
			<div className="table-header">
				<div className="table-name">{data.name}</div>
			</div>

			{columns.map((column: any) => (
				<div key={column.id} className="column-container">
					<img
						className="column-icon"
						src={
							column.is_primary_key || column.is_not_null
								? columnDiamondFull
								: columnDiamondEmpty
						}
						alt="column-icon"
					/>
					<div
						className={
							"column-name " +
							(column.is_primary_key ? "primary_key" : "")
						}
					>
						{column.name}
					</div>
					<div className="column-type">{column.type}</div>

					<Handle
						type="target"
						position={Position.Left}
						id={column.id + "_target"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						type="target"
						position={Position.Right}
						id={column.id + "_target"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						type="source"
						position={Position.Left}
						id={column.id + "_source"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						type="source"
						position={Position.Right}
						id={column.id + "_source"}
						isConnectable={false}
						style={handleStyle}
					/>
				</div>
			))}
		</div>
	);
}

export default TableNode;
