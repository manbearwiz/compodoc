import { Injectable } from '@angular/core';
import type { Http, Response } from '@angular/http';
import type { GameCharacterInterface } from './../models/characters.model';

import type { ActionInterface } from '../models/action.model';
import { AbstractService } from './abstract.service';

@Injectable()
export class CharactersService extends AbstractService {
    /**
     * List of characters availables in the game
     */
    characters: GameCharacterInterface[] = [];

    constructor(private http: Http) {
        super();
    }

    loadCharacters(): any {
        return this.http
            .get(`${this.ENDPOINT}gameCharacters`)
            .toPromise()
            .then((res: Response) => {
                const body = res.json();
                if (body._embedded.gameCharacters) {
                    this.characters = body._embedded.gameCharacters;
                }

                return this.characters;
            })
            .catch(this.handleError);
    }

    getCharacter(characterId: number): Promise<GameCharacterInterface> {
        if (this.characters.length > 0) {
            return Promise.resolve(this.characters.find(c => c.id === characterId));
        }
        return this.loadCharacters()
            .then((characters: GameCharacterInterface[]) => {
                return characters.find(c => c.id === characterId);
            })
            .catch(this.handleError);
    }

    getActions(characterId: number): Promise<ActionInterface[]> {
        const character = this.characters.find(c => c.id === characterId);
        if (character.actions) {
            return Promise.resolve(character.actions);
        }
        return this.http
            .get(`${this.ENDPOINT}gameCharacters/${characterId}/actions`)
            .toPromise()
            .then((res: Response) => {
                const body = res.json();
                const actions = body._embedded.actions;
                character.actions = actions;
                return actions;
            })
            .catch(this.handleError);
    }

    submitAction(gameToken, playerKey, actionName): void {
        this.http
            .post(
                `${this.ENDPOINT}fights/${gameToken}/players/${playerKey}/actions/${actionName}`,
                {}
            )
            .toPromise()
            .then((res: Response) => {
                const body = res.json();
                console.log(res);
            })
            .catch(this.handleError);
    }
}
