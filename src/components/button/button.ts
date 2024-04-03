import createHtmlElement from "../../utilities/html/create-html-element";

export default function button(
	config: {
		text: string,
		width: string,
		height: string,
		fontSize?: string,
		textColor?: string,
		background?: string,
		marginLeft?: string,
		marginTop?: string,
		onClick: (e: MouseEvent) => void,
	},
	parent?: HTMLElement,
): HTMLButtonElement {
	return createHtmlElement("button", function (btn) {
		this.width = config.width;
		this.height = config.height;
		if (config.textColor)
			this.color = config.textColor;
		if (config.background)
			this.background = config.background;
		if (config.marginLeft)
			this.marginLeft = config.marginLeft;
		if (config.marginTop)
			this.marginTop = config.marginTop;
		if (config.fontSize)
			this.fontSize = config.fontSize;
		this.padding = "0";
		this.userSelect = "none";
		btn.innerText = config.text;
		btn.onclick = config.onClick;
	}, parent);
}