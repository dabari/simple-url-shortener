import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { LinkMappingService } from "./link-mapping.service";
import { NgForm, NgModel, FormControl } from "@angular/forms";
import { Subject, Observable } from "rxjs";
import { EventManagerService } from "./event-manager.service";
import { takeUntil, debounceTime } from "rxjs/operators";
import { AppStoreService } from './app-store.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<IUser>;
  authenticated$: Observable<Boolean>;

  constructor(private appStoreService: AppStoreService){}

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.user$ = this.appStoreService.userStoreObservable();
    this.authenticated$ = this.appStoreService.authenticatedStoreObservable();
  }
}
