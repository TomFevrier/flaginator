const layout = {
	question: 'What is the layout (or layouts) of the flag?',
	multiple: true,
	options: [
		{ value: 'plain', label: 'Plain color' },
		{ value: 'bandsVertical', label: 'Vertical bands' },
		{ value: 'bandsHorizontal', label: 'Horizontal bands' },
		{ value: 'triangle', label: 'Triangle on the hoist-side' },
		{ value: 'diagonal', label: 'Diagonal' },
		{ value: 'unionJack', label: 'Union Jack in the canton' },
		{ value: 'stripes', label: 'Stripes' },
		{ value: 'cross', label: 'Cross' },
		{ value: 'misc', label: 'Miscellaneous'}
	]
};

const colors = {
	question: 'What are the main colors of the flag?',
	multiple: true,
	options: [
		{ value: 'black' },
		{ value: 'white' },
		{ value: 'red' },
		{ value: 'green' },
		{ value: 'blue' },
		{ value: 'yellow' },
		{ value: 'orange' }
	]
};

const figures = {
	question: 'Does the flag contain any figure?',
	multiple: true,
	options: [
		{ value: 'none', label: 'None' },
		{ value: 'star', label: 'Star(s)' },
		{ value: 'emblem', label: 'Emblem' },
		{ value: 'sun', label: 'Sun (or disk)' },
		{ value: 'crescent', label: 'Crescent' },
		{ value: 'bird', label: 'Bird (i.e. eagle)' },
		{ value: 'weapon', label: 'Weapon' },
		{ value: 'cross', label: 'Cross' },
		{ value: 'nature', label: 'Leaf/tree' },
		{ value: 'misc', label: 'Miscellaneous'}
	]
};

const nbStars = {
	question: 'How many stars does the flag contain?',
	multiple: false,
	options: [
		{ value: 1, label: 'A single star' },
		{ value: 2, label: '2 to 5 stars' },
		{ value: 6, label: '6 stars or more' },
	]
};

const nbBands = {
	question: 'How many bands has the flag?',
	multiple: false,
	options: [
		{ value: 'bandsVertical2', label: '2 bands' },
		{ value: 'bandsVertical3', label: '3 bands' },
		{ value: 'bandsVertical4', label: '4 bands or more' },
		{ value: 'bandsHorizontal2', label: '2 bands' },
		{ value: 'bandsHorizontal3', label: '3 bands' },
	]
};

export default {
	layout,
	colors,
	figures,
	nbStars,
	nbBands
}
