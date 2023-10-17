import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

import { ConfigService } from '../../_services/config.service';
import { navigation } from 'src/app/navigation/navigation';

@Component({
    selector: 'app-layout',
    templateUrl: './applayout.component.html',
    styleUrls: ['./applayout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutCompnent implements OnInit, OnDestroy, AfterViewInit {
    appConfig: any = {
        showLayout: 'false'
    };
    navigation: any = navigation;

    mouseclickListenerFn!: () => void;
    mouseclick$: Subject<number> = new Subject<number>();
    newlayoutVersion: boolean = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _configService: ConfigService,
        private renderer: Renderer2
    ) {
        this._configService._configSubject.subscribe((data) => {
            this.appConfig.showLayout = data;
        })
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.mouseclick$.pipe(
            buffer(this.mouseclick$.pipe(debounceTime(250))),
            map(clicks => clicks.length),
            filter(clicksLength => clicksLength >= 10))
            .subscribe(_ => {
                this.newlayoutVersion = !this.newlayoutVersion;
            })

    }

    ngAfterViewInit(): void {
        // this.mouseclickListenerFn = this.renderer.listen('window', 'click', (e: MouseEvent) => {
        //     if (e.which === 1) {
        //         this.mouseclick$.next();
        //     }
        // })

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        if (this.mouseclickListenerFn) this.mouseclickListenerFn();
    }
}
