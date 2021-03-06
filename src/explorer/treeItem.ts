import { TreeItem, TreeItemCollapsibleState, Command } from "vscode";
import { join, basename } from "path";

export interface SQLTree {
    [dbPath: string]: DBItem;
}

export class SQLItem extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command
    ) {
        super(label, collapsibleState);
    }
}

export class DBItem extends SQLItem {
    
    constructor(public dbPath: string, command?: Command) {
        super(
            basename(dbPath),
            TreeItemCollapsibleState.Collapsed,
            command
        );

        this.iconPath = {
            light: join(__filename, '..', '..', '..', 'resources', 'light', 'database.svg'),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'database.svg')
        };

        this.contextValue = 'sqlite.databaseItem';
    }

    get tooltip(): string {
        return `${this.dbPath}`;
    }
}

export class TableItem extends SQLItem {

    constructor(name: string, command?: Command) {
        super(
            name,
            TreeItemCollapsibleState.Collapsed,
            command
        );
        this.contextValue = 'sqlite.tableItem';
    }

    get tooltip(): string {
        //var dbName = basename(dirname(this.id));
        //var dbNameNoExtension = dbName.substr(0, dbName.lastIndexOf('.')) || dbName;
        return `${this.label}`;
    }
}

export class ColumnItem extends SQLItem {

    constructor(private name:string, private type: string,
            private notnull: boolean, private pk: number, private defVal: string, command?: Command) {
        super(
            name+` : ${type.toLowerCase()}`,
            TreeItemCollapsibleState.None,
            command
        );
        
        this.contextValue = 'sqlite.columnItem';

        let iconName = notnull? 'col_notnull.svg' : 'col_nullable.svg';
        iconName = pk > 0? 'col_pk.svg' : iconName;

        this.iconPath = {
            light: join(__filename, '..', '..', '..', 'resources', 'light', iconName),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', iconName)
        };
    }

    get tooltip(): string {
        let pkTooltip = this.pk? '\nPRIMARY KEY' : '';
        let notnullTooltip = this.notnull? '\nNOT NULL' : '';
        let defvalTooltip = this.defVal !== 'NULL'? `\nDEFAULT: ${this.defVal}` : '';
        return `${this.name}\n${this.type}${pkTooltip}${notnullTooltip}${defvalTooltip}`;
    }

}