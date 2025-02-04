import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: '[appRxUnsubscribe]',
})
export class RxUnsubscribe implements OnDestroy {

    private destroy: Subject<void> = new Subject();
    public destroy$ = this.destroy.asObservable();

    public ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }
    constructor() { }

}
