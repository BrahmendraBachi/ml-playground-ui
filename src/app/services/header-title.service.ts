import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderTitleService {

    private headerTitle = new BehaviorSubject<string>("ML Playground UI");
    public headerTitleObservable$ = this.headerTitle.asObservable();

    constructor() { }

    public updateHeaderTitle(title: string): void {
        this.headerTitle.next(title);
    }

}
