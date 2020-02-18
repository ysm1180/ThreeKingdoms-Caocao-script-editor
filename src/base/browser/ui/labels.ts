export class Label {
    private label: HTMLElement;
    private labelDescription: HTMLElement;

    constructor(container: HTMLElement) {
        this.label = document.createElement('div');
        this.label.className = 'label';

        this.labelDescription = document.createElement('div');
        this.labelDescription.className = 'label-description';

        this.label.appendChild(this.labelDescription);
        container.appendChild(this.label);
    }

    public get element() {
        return this.label;
    }

    public setValue(value: string) {
        this.label.title = value;
        this.labelDescription.textContent = value;
    }
}
