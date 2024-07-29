export function getNewId(): string {
	return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
}

export function getDefaultColumns(): any[] {
	return [
		{
			id: getNewId(),
			name: "id",
			type: "int",
			is_primary_key: true,
			is_nullable: false,
		},
	];
}
