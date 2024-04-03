import InspectWindow from "./components/inspect-window/inspect-window";

declare global {
    interface Window {
        inspectWindow: InspectWindow;
    }
}

export { };