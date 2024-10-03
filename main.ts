import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
	statusBarTextElement: HTMLSpanElement;
	onload(): void {
		this.statusBarTextElement = this.addStatusBarItem().createEl('span');
		this.UpdateLineCountForActiveFile();21

		this.app.workspace.on('active-leaf-change', async () => {
			this.UpdateLineCountForActiveFile();

			this.app.workspace.on('editor-change', editor => {
				const content = editor.getDoc().getValue();
				this.updateLineCount(content);
			});
		});
	};

	private updateLineCount(fileContent?: string) {
		let count = 0;
		if (fileContent) {
			count = fileContent.split(/\r\n|\r|\n/). length;
		};
		const lineWord = count === 1 ? 'line' : 'lines';
		this.statusBarTextElement.textContent = `${count} ${lineWord}`
	}

	private async UpdateLineCountForActiveFile() {
		const file = this.app.workspace.getActiveFile();
	
		if (file) {
			const content = await this.app.vault.read(file);
			this.updateLineCount(content);
		} else {
			// Sets linecount back to 0 when opening a new note.
			this.updateLineCount(undefined)
		}
	}
};