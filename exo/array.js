const array = [
	{
		name: "albert",
		age: 43
	},
	{
		name: "bob",
		age: 45
	},
	{
		name: "michel",
		age: 12
	}
]

function filter_array(array, filter) {

	return typeof filter === 'string' ? array.filter(x => x.name.includes(filter)) : array.filter(x => x.age > filter);
}

const result_num = filter_array(array,20);
console.log("result_num : ", result_num);

const result_string = filter_array(array, "m");
console.log("result_string : ", result_string);
