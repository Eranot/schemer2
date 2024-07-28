import { Handle, Position } from "@xyflow/react";

import "./style.css";

const handleStyle = {
	// make it invisible
	background: "transparent",
	border: "none",
	borderWidth: 0,
};

function TableNode({ data }: any) {
	// const onChange = useCallback((evt: any) => {
	// 	console.log(evt.target.value);
	// }, []);

	return (
		<div className="table-container">
			<div className="table-header">
				<div className="table-name">{data.name}</div>
			</div>

			{data.columns.map((column: any) => (
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
