import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AppStoreService } from "../app-store.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(private appStoreService: AppStoreService) {}

  ngOnInit() {
    this.user$ = this.appStoreService.userStoreObservable();
  }

  logout() {
		this.appStoreService.setUser(null);
	}
}
