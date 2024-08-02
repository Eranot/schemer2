import Column from "./column";
import Constraint from "./contraint";

type Table = {
	id: number;
	columns: Column[];
	constraints: Constraint[];
	name: string;
	position: {
		x: number;
		y: number;
	};
};

export default Table;
