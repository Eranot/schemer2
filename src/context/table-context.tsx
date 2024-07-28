import React, { createContext, useState, useContext, ReactNode } from "react";

interface TableContextProps {
	selectedTable: any | null;
	setSelectedTable: (table: any | null) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [selectedTable, setSelectedTable] = useState<any | null>(null);

	return (
		<TableContext.Provider value={{ selectedTable, setSelectedTable }}>
			{children}
		</TableContext.Provider>
	);
};

export const useTable = (): TableContextProps => {
	const context = useContext(TableContext);
	if (!context) {
		throw new Error("useTable must be used within a TableProvider");
	}
	return context;
};
