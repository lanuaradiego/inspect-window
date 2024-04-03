import LogType from "../../enums/log-type";
import formatDateTime from "../../utilities/format-date-time";
import createHtmlElement from "../../utilities/html/create-html-element";
import objectToString from "../../utilities/objects/object-to-string";

export default function logInputLine(type: LogType, color: string, source: string, instant: Date, args: any[]): HTMLDivElement {
	const htmlElement = createHtmlElement("div", function () {
		this.width = "100%";
		this.marginTop = "2px";
		this.borderBottom = "1px solid gray"
	});

	const htmlType = createHtmlElement("span", function (el) {
		this.float = "right";
		this.fontSize = ".75em";
		this.color = color;
		el.innerText = type;
	});

	const htmlSource = createHtmlElement("p", function (el) {
		this.color = "gray";
		this.fontSize = ".8em";
		this.marginBottom = "2px";
		this.marginTop = "2px";
		this.userSelect = "auto";
		this.display = "none";
		el.innerText = formatDateTime(instant) + '\n' + source;
	});

	const htmlSourceButton = createHtmlElement("span", function (el) {
		this.float = "right";
		this.fontSize = ".75em";
		this.color = "blue";
		this.paddingRight = "5px";
		el.innerText = "see source";
		el.onclick = () => {
			const isHidden = htmlSource.style.display === "none";
			if (isHidden) {
				htmlSource.style.display = "inline-block";
				htmlSourceButton.innerText = "hide source";
			} else {
				htmlSource.style.display = "none";
				htmlSourceButton.innerText = "see source";
			}
		}
	});


	const htmlText = createHtmlElement("h5", function (el) {
		this.width = "100%";
		this.fontWeight = "bold";
		this.marginTop = "2px";
		this.marginBottom = "15px";
		this.color = color;
		this.userSelect = "auto";
		let parsed: string;
		try {
			parsed = objectToString(args, 5);
		}
		catch (e) {
			parsed = args + "";
		}
		el.innerText = parsed;
	});

	htmlElement.appendChild(htmlType);
	htmlElement.appendChild(htmlSourceButton);
	htmlElement.appendChild(htmlSource);
	htmlElement.appendChild(htmlText);
	return htmlElement;
}