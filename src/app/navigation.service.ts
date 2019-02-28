import { Router } from "@angular/router";

export class NavigationService {
    constructor(private router: Router) { }
        public navigateTo(route: string): void {
        this.router.navigate([route])
    }
}