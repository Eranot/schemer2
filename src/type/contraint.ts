import ConstraintTypeEnum from "../enum/constraint-type-enum";
import ConstraintRelationship from "./constraint-relationship";

type Constraint = {
	id: number;
	type: ConstraintTypeEnum;
	target_table_id: number;
	relationships: ConstraintRelationship[];
};

export default Constraint;
