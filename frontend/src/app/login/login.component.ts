import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccountService } from "../account.service";
import { Subject } from "rxjs";
import { AppStoreService } from "../app-store.service";
import { LinkMappingService } from "../link-mapping.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string | null;
  username: string;
  password: string;
  rememberMe: boolean;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private appStoreService: AppStoreService,
    private accountService: AccountService,
    private linkMappingService: LinkMappingService
  ) {}

  ngOnInit() {}

  login() {
    const credentials: ICredentials = {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe,
    };

    this.accountService.logIn(credentials).subscribe(
      (user) => {
        this.errorMessage = null;
        this.appStoreService.setUser(user);
      },
      (err) => (this.errorMessage = err)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
