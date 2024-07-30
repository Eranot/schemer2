import { Edge, Node } from "@xyflow/react";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface EditorContextProps {
	nodes: Node[];
	setNodes: (nodes: React.SetStateAction<Node[]>) => void;
	edges: Edge[];
	setEdges: (edges: React.SetStateAction<Edge[]>) => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	return (
		<EditorContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
			{children}
		</EditorContext.Provider>
	);
};

export const useEditor = (): EditorContextProps => {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("useTable must be used within a TableProvider");
	}
	return context;
};
