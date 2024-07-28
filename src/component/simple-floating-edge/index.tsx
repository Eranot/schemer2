import { EdgeProps, getSmoothStepPath, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "../../util/react-flow-utils";

import "./style.css";

function SimpleFloatingEdge({
	id,
	source,
	target,
	markerEnd,
	style,
	sourceHandleId,
	targetHandleId,
}: EdgeProps) {
	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
		sourceNode,
		targetNode,
		sourceHandleId,
		targetHandleId,
	);

	const [edgePath] = getSmoothStepPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetPosition: targetPos,
		targetX: tx,
		targetY: ty,
	});

	return (
		<path
			id={id}
			className="react-flow__edge-path"
			d={edgePath}
			strokeWidth={5}
			markerEnd={markerEnd}
			style={style}
		/>
	);
}

export default SimpleFloatingEdge;
