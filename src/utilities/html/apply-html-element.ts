export default function applyHtmlElement<K extends keyof HTMLElementTagNameMap>(element: HTMLElementTagNameMap[K], block: (this: CSSStyleDeclaration) => void): HTMLElementTagNameMap[K] {
    block.apply(element.style);
    return element;
}