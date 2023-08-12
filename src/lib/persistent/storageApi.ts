export interface ITypedStorage<T> {
    length: number;

    key<U extends keyof T>(index: number): U;

    setItem<U extends keyof T>(key: U, value: T[U]): void;

    getItem<U extends keyof T>(key: U): T[U] | null;

    removeItem<U extends keyof T>(key: U): void;

    clear(): void;
}



export class TypedStorage<T> implements ITypedStorage<T> {
    private readonly storage: Storage;

    constructor() {
        const browserStorage = typeof window !== 'undefined' && window?.["localStorage"];
        this.storage = browserStorage || global["localStorage"];
        if (!this.storage) {
            throw Error('Web Storage API not found.');
        }
    }

    public get length(): number {
        return this.storage?.length;
    }

    public key<U extends keyof T>(index: number): U {
        return this.storage?.key(index) as U;
    }

    public getItem<U extends keyof T>(key: U): T[U] | null {
        const item = this.storage?.getItem(key.toString());
        if (item == null) {
            return item;
        }

        try {
            return JSON.parse(item) as T[U];
        } catch (error) {
            throw error;
        }
    }

    public getItemMap<U extends keyof T>(key: U): T[U] | null {
        const flattenedMap = this.getItem(key);
        if(!flattenedMap)
            return null
        //@ts-ignore
        return this.unflattenMap(flattenedMap)
    }

    public setItemMap<U extends keyof T>(key: U, value: T[U]): void {
        //@ts-ignore
        const flattenedMap = this.flattenMap(value);
        //@ts-ignore
        this.setItem(key, flattenedMap);
    }

    private flattenMap(map: Map<any, any>) {
        return Array.from(map.entries());
    }

    private unflattenMap(flattenedMap: []) {
        return new Map(flattenedMap)

    }

    public setItem<U extends keyof T>(key: U, value: T[U]): void {
        this.storage?.setItem(key.toString(), JSON.stringify(value));
    }

    public removeItem<U extends keyof T>(key: U): void {
        this.storage?.removeItem(key.toString());
    }

    public clear(): void {
        this.storage?.clear();
    }
}

export class MemoryStorage implements Storage {
    private readonly storage: Map<string, string>;

    constructor() {
        this.storage = new Map<string, string>();
    }

    public get length(): number {
        return Array.from(this.storage.keys()).length;
    }

    public key(index: number): string {
        return Array.from(this.storage.keys())[index];
    }

    public getItem(key: string): string | null {
        return this.storage.get(key) || null;
    }

    public setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

    public removeItem(key: string): void {
        this.storage.delete(key);
    }

    public clear(): void {
        this.storage.clear();
    }
}
