type Column = {
	id: number;
	is_auto_increment: boolean;
	is_not_null: boolean;
	is_primary_key: boolean;
	is_unique: boolean;
	name: string;
	type: string;
};

export default Column;
