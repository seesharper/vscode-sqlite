import { Disposable, languages, TextDocument } from 'vscode';
import { CompletionProvider } from './completionProvider';
import { Schema } from '../interfaces';

export default class LanguageServer implements Disposable {
    private subscriptions: Disposable[];
    private schemaHandler?: (doc: TextDocument) => Thenable<Schema|void>;
    private completionProvider: CompletionProvider;

    constructor() {
        this.subscriptions = [];

        this.completionProvider = new CompletionProvider({
            provideSchema: (doc) => {
                if (this.schemaHandler) return this.schemaHandler(doc);
                else return Promise.resolve();
            }
        });

        let documentSelector = { scheme: 'file', language: 'sql' };
        this.subscriptions.push(languages.registerCompletionItemProvider(documentSelector, this.completionProvider, '.'));
    }

    setSchemaHandler(schemaHandler: (doc: TextDocument) => Thenable<Schema|void>) {
        this.schemaHandler = schemaHandler;
    }

    dispose() {
        Disposable.from(...this.subscriptions).dispose();
    }
}