export default function createHtmlElement<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	block: (this: CSSStyleDeclaration, element: HTMLElementTagNameMap[K]) => void,
	parent?: HTMLElement,
): HTMLElementTagNameMap[K] {
	const el = document.createElement(tag);
	block.apply(el.style, [el]);
	parent?.appendChild(el);
	return el;
}