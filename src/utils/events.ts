import { ProductEvent } from "../models/common.models";

export class EventsCreator<T extends ProductEvent> {
    private data: Omit<T, 'type' | 'timestamp' | 'status' | 'error'>;
    private type: T['type'];

    constructor(type: T['type'], data: Omit<T, 'type' | 'timestamp' | 'status' | 'error'>) {
        this.type = type;
        this.data = data;
    }

    create(): T {
        return {
            type: this.type,
            error: null,
            timestamp: new Date(),
            ...this.data,
            status: "SUCCESS"
        } as T;
    }
}