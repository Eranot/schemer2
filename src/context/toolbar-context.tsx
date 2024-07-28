import React, { createContext, useState, useContext, ReactNode } from "react";
import ToolEnum from "../enum/tool-enum";

interface ToolbarContextProps {
	currentTool: ToolEnum;
	setCurrentTool: (tool: ToolEnum) => void;
}

const ToolbarContext = createContext<ToolbarContextProps | undefined>(
	undefined,
);

export const ToolbarProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentTool, setCurrentTool] = useState<ToolEnum>(ToolEnum.SELECT);

	return (
		<ToolbarContext.Provider value={{ currentTool, setCurrentTool }}>
			{children}
		</ToolbarContext.Provider>
	);
};

export const useToolbar = (): ToolbarContextProps => {
	const context = useContext(ToolbarContext);
	if (!context) {
		throw new Error("useToolbar must be used within a ToolbarProvider");
	}
	return context;
};
