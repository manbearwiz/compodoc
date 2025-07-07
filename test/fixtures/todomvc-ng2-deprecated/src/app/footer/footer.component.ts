import { Component } from '@angular/core';

import type { TodoStore } from '../shared/services/todo.store';

import { EmitterService } from '../shared/services/emitter.service';

import {
    LogClass,
    LogClassWithArgs,
    LogMethod,
    LogProperty,
    LogPropertyWithArgs
} from '../shared/decorators/log.decorator';

import { FooterComponentSchema } from './footer-component.metadata';

/**
 * The footer component
 */
@LogClassWithArgs('toto')
@Component(FooterComponentSchema)
export class FooterComponent {
    /**
     * Local reference of TodoStore
     */
    todoStore: TodoStore;
    /**
     * Local id for EmitterService
     */
    @LogProperty
    id = 'FooterComponent';

    /**
     * Starting filter param
     */
    @LogPropertyWithArgs('theCurrentFilter')
    currentFilter = 'all';

    /**
     * The "constructor"
     *
     * @param {TodoStore} todoStore A TodoStore
     */
    constructor(todoStore: TodoStore) {
        this.todoStore = todoStore;
    }

    /**
     * Removes all the completed todos
     */
    @LogMethod
    removeCompleted() {
        this.todoStore.removeCompleted();
    }

    /**
     * Display only completed todos
     */
    displayCompleted() {
        this.currentFilter = 'completed';
        EmitterService.get(this.id).emit('displayCompleted');
    }

    /**
     * Display only remaining todos
     */
    displayRemaining() {
        this.currentFilter = 'remaining';
        EmitterService.get(this.id).emit('displayRemaining');
    }

    /**
     * Display all todos
     */
    displayAll() {
        this.currentFilter = 'all';
        EmitterService.get(this.id).emit('displayAll');
    }
}
