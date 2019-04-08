import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    isGreen = true;

    constructor(private cdRef: ChangeDetectorRef) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    dummy(): void {

    }

    switchStyle() {
        this.isGreen = !this.isGreen;
        this.cdRef.detectChanges();
    }
    tapEvent() {
        alert('Tap Event Works too');
    }
}
