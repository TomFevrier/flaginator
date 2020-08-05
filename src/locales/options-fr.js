const layout = {
	question: 'Quel est le type du drapeau ?',
	multiple: true,
	options: [
		{ value: 'plain', label: 'Uni' },
		{ value: 'bandsVertical', label: 'Bandes verticales' },
		{ value: 'bandsHorizontal', label: 'Bandes horizontales' },
		{ value: 'triangle', label: 'Triangle du côté de la hampe' },
		{ value: 'diagonal', label: 'Diagonale' },
		{ value: 'unionJack', label: 'Union Jack dans le canton' },
		{ value: 'stripes', label: 'Rayures' },
		{ value: 'cross', label: 'Croix' },
		{ value: 'misc', label: 'Autre'}
	]
};

const colors = {
	question: 'Quelles sont les couleurs principales du drapeau ?',
	multiple: true,
	options: [
		{ value: 'red' },
		{ value: 'blue' },
		{ value: 'green' },
		{ value: 'white' },
		{ value: 'yellow' },
		{ value: 'black' },
		{ value: 'orange' }
	]
};

const figures = {
	question: 'Le drapeau contient-il un symbole ?',
	multiple: true,
	options: [
		{ value: 'none', label: 'Aucun' },
		{ value: 'star', label: 'Étoile(s)' },
		{ value: 'emblem', label: 'Emblème' },
		{ value: 'sun', label: 'Soleil (ou disque)' },
		{ value: 'crescent', label: 'Croissant' },
		{ value: 'bird', label: 'Oiseau/aigle' },
		{ value: 'weapon', label: 'Arme' },
		{ value: 'cross', label: 'Croix' },
		{ value: 'nature', label: 'Arbre/feuille' },
		{ value: 'misc', label: 'Divers'}
	]
};

const nbStars = {
	question: 'Combien d\'étoiles contient le drapeau ?',
	multiple: false,
	options: [
		{ value: 1, label: 'Une seule étoile' },
		{ value: 2, label: '2 à 5 étoiles' },
		{ value: 6, label: '6 étoiles ou plus' },
	]
};

const nbBands = {
	question: 'Combien de bandes possède le drapeau ?',
	multiple: false,
	options: [
		{ value: 'bandsVertical2', label: '2 bandes' },
		{ value: 'bandsVertical3', label: '3 bandes' },
		{ value: 'bandsVertical4', label: '4 bandes ou plus' },
		{ value: 'bandsHorizontal2', label: '2 bandes' },
		{ value: 'bandsHorizontal3', label: '3 bandes' },
	]
};

export default {
	layout,
	colors,
	figures,
	nbStars,
	nbBands
}
