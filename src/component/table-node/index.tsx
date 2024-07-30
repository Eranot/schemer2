import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";

import "./style.css";
import { useMemo } from "react";

const handleStyle = {
	background: "transparent",
	border: "none",
	borderWidth: 0,
};

function TableNode({ id, data }: any) {
	const updateNodeInternals = useUpdateNodeInternals();

	const columns = useMemo(() => {
		updateNodeInternals(id);
		return data.columns;
	}, [data.columns]);

	return (
		<div className="table-container">
			<div className="table-header">
				<div className="table-name">{data.name}</div>
			</div>

			{columns.map((column: any) => (
				<div key={column.id} className="column-container">
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
						key={column.id + "_target"}
						type="target"
						position={Position.Left}
						id={column.id + "_target"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						key={column.id + "_target"}
						type="target"
						position={Position.Right}
						id={column.id + "_target"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						key={column.id + "_source"}
						type="source"
						position={Position.Left}
						id={column.id + "_source"}
						isConnectable={false}
						style={handleStyle}
					/>

					<Handle
						key={column.id + "_source"}
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
