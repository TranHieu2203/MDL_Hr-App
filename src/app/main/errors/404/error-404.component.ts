import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error-404',
    templateUrl: './error-404.component.html',
    styleUrls: ['./error-404.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error404Component {
    /**
     * Constructor
     */
    constructor(       
public router: Router) {
    }
    navigate(){
        this.router.navigate(['/']);
    }
}
