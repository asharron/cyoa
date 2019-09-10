import { EventEmitter } from 'events';

export class EventBus {
    controlsBus: EventEmitter;
    menuBus: EventEmitter;
    mapBus: EventEmitter;

    constructor() {
        this.controlsBus = new EventEmitter();
        this.menuBus = new EventEmitter();
        this.mapBus = new EventEmitter();
    }

    onControlsBus(event: string, callback: any) {
        this.controlsBus.on(event, callback);
    }

    emitOnControlsBus(event: string, msg: string) {
        this.controlsBus.emit(event, msg);
    }

    onMapBus(event: string, callback: any) {
        this.mapBus.on(event, callback);
    }

    emitOnMapBus(event: string, msg: any) {
        this.mapBus.emit(event, msg);
    }

    onMenuBus(event: string, callback: any) {
        this.menuBus.on(event, callback);
    }

    emitOnMenuBus(event: string, msg: string) {
        this.menuBus.emit(event, msg);
    }
}

let eventBus: EventBus = new EventBus();

module.exports = eventBus;