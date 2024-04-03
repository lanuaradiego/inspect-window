const enum FormAction {
	None = 0,
	Move = 1,
	ResizeRight = 1 << 1,
	ResizeLeft = 1 << 2,
	ResizeTop = 1 << 3,
	ResizeBottom = 1 << 4,
}

export default FormAction;