type Column = {
	id: number;
	name: string;
	type: string;
	is_auto_increment: boolean;
	is_not_null: boolean;
	is_primary_key: boolean;
	is_unique: boolean;
};

export default Column;
