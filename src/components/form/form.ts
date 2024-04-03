import FormAction from "./form-action";
import alternateBit from "../../utilities/bits/alternante-bits";
import checkBits from "../../utilities/bits/check-bits";
import applyHtmlElement from "../../utilities/html/apply-html-element";
import createHtmlElement from "../../utilities/html/create-html-element";
import button from "../button/button";
import FormState from "./form-state";

export default class Form {
	private static readonly BORDER_SIZE = 4;
	private static readonly BUTTON_HEIGHT = 20;
	private static readonly BUTTON_WIDTH = 30;
	private static readonly MIN_WIDTH = ((Form.BUTTON_WIDTH + Form.BORDER_SIZE) * 2) + "px";
	private static readonly MIN_HEIGHT = (Form.BUTTON_HEIGHT + (Form.BORDER_SIZE * 2)) + "px";

	private readonly htmlElement: HTMLDivElement;
	private readonly divContent: HTMLDivElement;
	private readonly btnClose: HTMLButtonElement;
	private readonly btnMaximize: HTMLButtonElement;

	private wasMoved: boolean = false;
	private state: FormState = FormState.Normal;
	private stateLeft: string = "";
	private stateTop: string = "";
	private stateWidth: string = "";
	private stateHeight: string = "";

	private action: FormAction = FormAction.None;
	private actionOffsetX: number = 0;
	private actionOffsetY: number = 0;

	constructor() {
		const borderSize = Form.BORDER_SIZE + "px";
		const buttonWidth = Form.BUTTON_WIDTH + "px";
		const buttonHeight = Form.BUTTON_HEIGHT + "px";

		this.htmlElement = createHtmlElement("div", function () {
			this.position = "fixed";
			this.zIndex = "99999999";
			this.backgroundColor = "#4295f5";
			this.left = "0px";
			this.top = "0px";
			this.width = "100px";
			this.height = "150px";
			this.minWidth = Form.MIN_WIDTH;
			this.minHeight = Form.MIN_HEIGHT;
			this.touchAction = "none";
		});
		this.htmlElement.addEventListener("pointerdown", this.onClickDown);

		this.btnClose = button({
			width: buttonWidth,
			height: buttonHeight,
			text: "✕",
			fontSize: ".8em",
			textColor: "white",
			background: "#ff4242",
			marginTop: borderSize,
			marginLeft: borderSize,
			onClick: e => {
				e.preventDefault();
				e.stopPropagation();
				this.alternateCloseState();
			},
		}, this.htmlElement);

		this.btnMaximize = button({
			width: buttonWidth,
			height: buttonHeight,
			text: "□",
			fontSize: ".8em",
			textColor: "white",
			background: "#4295f5",
			marginTop: borderSize,
			onClick: e => {
				e.preventDefault();
				e.stopPropagation();
				this.alternateMaximizeState();
			},
		}, this.htmlElement);

		this.divContent = createHtmlElement("div", function () {
			this.position = "absolute";
			this.top = (Form.BUTTON_HEIGHT + Form.BORDER_SIZE * 2) + "px";
			this.left = borderSize;
			this.right = borderSize;
			this.bottom = borderSize;
			this.backgroundColor = "#fafafa";
		}, this.htmlElement);

		this.alternateCloseState();
		this.hide();
	}

	public show() {
		this.htmlElement.style.display = "block";
	}

	public hide() {
		this.htmlElement.style.display = "none";
	}

	public attachTo(parent: HTMLElement) {
		parent.appendChild(this.htmlElement);
	}

	public appendChild(child: HTMLElement) {
		this.divContent.appendChild(child);
	}

	private alternateCloseState() {
		if (!this.wasMoved) {
			let iconText: string;
			if (checkBits(this.state, FormState.Closed)) {
				this.restoreCloseForm();
				iconText = "✕";
			} else {
				this.closeForm();
				iconText = "▣";
			}
			this.state = alternateBit(this.state, FormState.Closed);
			this.btnClose.innerText = iconText;
		}
	}

	private closeForm() {
		this.btnMaximize.style.visibility = "hidden";
		this.divContent.style.visibility = "hidden";
		if (!checkBits(this.state, FormState.Maximized)) {
			this.stateWidth = this.htmlElement.style.width;
			this.stateHeight = this.htmlElement.style.height;
		}
		applyHtmlElement(this.htmlElement, function () {
			this.minWidth = "";
			this.minHeight = "";
			this.width = (Form.BUTTON_WIDTH + Form.BORDER_SIZE * 2) + "px";
			this.height = (Form.BUTTON_HEIGHT + Form.BORDER_SIZE * 2) + "px";
		});
	}

	private restoreCloseForm() {
		this.btnMaximize.style.visibility = "visible";
		this.divContent.style.visibility = "visible";
		if (checkBits(this.state, FormState.Maximized)) {
			this.maximizeForm();
		} else {
			this.htmlElement.style.width = this.stateWidth;
			this.htmlElement.style.height = this.stateHeight;
		}
		applyHtmlElement(this.htmlElement, function () {
			this.minWidth = Form.MIN_WIDTH;
			this.minHeight = Form.MIN_HEIGHT;
		});
	}

	private alternateMaximizeState() {
		let iconText: string;
		if (checkBits(this.state, FormState.Maximized)) {
			this.restoreMaximizeForm();
			iconText = "□";
		} else {
			this.saveFormSizeAndPosition();
			this.maximizeForm();
			iconText = "❐";
		}
		this.state = alternateBit(this.state, FormState.Maximized);
		this.btnMaximize.innerText = iconText;
	}

	private saveFormSizeAndPosition() {
		this.stateLeft = this.htmlElement.style.left;
		this.stateTop = this.htmlElement.style.top;
		this.stateWidth = this.htmlElement.style.width;
		this.stateHeight = this.htmlElement.style.height;
	}

	private loadFormSizeAndPosition() {
		this.htmlElement.style.left = this.stateLeft;
		this.htmlElement.style.top = this.stateTop;
		this.htmlElement.style.width = this.stateWidth;
		this.htmlElement.style.height = this.stateHeight;
	}

	private maximizeForm() {
		applyHtmlElement(this.htmlElement, function () {
			this.left = "0px";
			this.top = "0px";
			this.width = "100vw";
			this.height = "100vh";
		});
	}

	private restoreMaximizeForm() {
		this.loadFormSizeAndPosition();
	}

	private onClickDown = (e: MouseEvent) => {
		if (!checkBits(this.state, FormState.Maximized)) {
			const isClosed = checkBits(this.state, FormState.Closed);
			if (e.target === this.htmlElement || isClosed) {
				const size = this.htmlElement.getBoundingClientRect();
				this.action = FormAction.None;

				if (!isClosed) {
					if (e.offsetX <= Form.BORDER_SIZE)
						this.action |= FormAction.ResizeLeft;
					else if (e.offsetX >= size.width - Form.BORDER_SIZE)
						this.action |= FormAction.ResizeRight;

					if (e.offsetY <= Form.BORDER_SIZE)
						this.action |= FormAction.ResizeTop;
					else if (e.offsetY >= size.height - Form.BORDER_SIZE)
						this.action |= FormAction.ResizeBottom;
				}

				if (this.action == FormAction.None && e.offsetY <= Form.BORDER_SIZE * 2 + Form.BUTTON_HEIGHT)
					this.action = FormAction.Move;

				if (this.action != FormAction.None) {
					let fncOnDrag: (e: MouseEvent) => void;
					let fncOnStop: () => void;
					if (this.action == FormAction.Move) {
						fncOnDrag = this.onMove;
						fncOnStop = this.onStopMove;
					} else {
						fncOnDrag = this.onResize;
						fncOnStop = this.onStopResize;
					}

					this.actionOffsetX = e.clientX - size.left;
					this.actionOffsetY = e.clientY - size.top;
					document.addEventListener('pointermove', fncOnDrag);
					document.addEventListener("pointerup", fncOnStop);
				}
			}
		}
	};

	private onMove = (e: MouseEvent) => {
		this.wasMoved = true;
		this.htmlElement.style.left = (e.clientX - this.actionOffsetX) + 'px';
		this.htmlElement.style.top = (e.clientY - this.actionOffsetY) + 'px';
	}

	private onStopMove = () => {
		document.removeEventListener("pointermove", this.onMove);
		document.removeEventListener("pointerup", this.onMove);
		setTimeout(() => { this.wasMoved = false; });
	}

	private onResize = (e: MouseEvent) => {
		const size = this.htmlElement.getBoundingClientRect();

		if (checkBits(this.action, FormAction.ResizeRight)) {
			this.htmlElement.style.width = (e.clientX - size.left) + 'px';
		} else if (checkBits(this.action, FormAction.ResizeLeft)) {
			this.htmlElement.style.left = (e.clientX - this.actionOffsetX) + 'px';
			this.htmlElement.style.width = size.width - e.movementX + 'px';
		}

		if (checkBits(this.action, FormAction.ResizeBottom)) {
			this.htmlElement.style.height = (e.clientY - size.top) + 'px';
		} else if (checkBits(this.action, FormAction.ResizeTop)) {
			this.htmlElement.style.top = (e.clientY - this.actionOffsetY) + 'px';
			this.htmlElement.style.height = size.height - e.movementY + 'px';
		}
	};

	private onStopResize = () => {
		document.removeEventListener("pointermove", this.onResize);
		document.removeEventListener("pointerup", this.onResize);
		setTimeout(() => { this.wasMoved = false; });
	};
}