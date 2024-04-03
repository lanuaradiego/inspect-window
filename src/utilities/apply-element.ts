export default function applyElement<T>(element: T, block: (this: T) => void): T {
	block.apply(element);
	return element;
}