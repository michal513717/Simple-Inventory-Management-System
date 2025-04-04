import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'
import { EventStoreData, ProductEvent } from '../models/common.models';
import { join } from 'path';
import * as log4js from 'log4js';

/**
 * @fileOverview EventStore - Manages storing and retrieving events, initializing the event store, and logging events.
 * 
 * @author Michał Kuś
 * @class
 * @param {string} filename - The name of the file to store events
 * @param {string} [dataDir='data'] - The directory where the file will be stored
 */

const logger = log4js.getLogger();

export class EventStore {
    private db: Low<EventStoreData>;
    private filename: string;

    constructor(filename: string, dataDir = 'data') {
        this.filename = join(__dirname, dataDir, filename);
        const adapter = new JSONFile<EventStoreData>(this.filename);
        this.db = new Low<EventStoreData>(adapter, { events: [] });
    }

    async init(): Promise<void> {
        try {
            await this.db.read();
            this.db.data ||= { events: [] };
            await this.db.write();
        } catch (error) {
            logger.error("Error initializing EventStore:", error);
            throw error;
        }
    }

    async append(event: ProductEvent): Promise<void> {
        try {
            await this.db.read();
            this.db.data!.events.push(event);
            await this.db.write();
        } catch (error) {
            logger.error("Error appending event:", error);
            throw error;
        }
    }

    async getEvents(aggregateId: string): Promise<ProductEvent[]> {
        try {
            await this.db.read();
            if (!this.db.data) return [];
            return this.db.data.events.filter(event => (event as any).productId === aggregateId || (event as any).orderId === aggregateId);
        } catch (error) {
            logger.error("Error getting events:", error);
            return [];
        }
    }

    async getAllEvents(): Promise<ProductEvent[]> {
        try {
            await this.db.read();
            return this.db.data?.events || [];
        } catch (error) {
            logger.error("Error getting all events:", error);
            return [];
        }
    }
}
