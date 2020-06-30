import { Injectable } from "@angular/core";
import { EventManagerService } from "./event-manager.service";
import { StateStore } from "./state-store";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AppStoreService {
  private userStore: StateStore<IUser> = new StateStore(null);

  private authenticatedStore: StateStore<Boolean> = new StateStore(false);

  constructor(private eventManagerService: EventManagerService) {
    this.userStoreObservable()
      //.pipe(filter((user) => user !== undefined))
      .subscribe((user) => {
        if (user !== null) {
          this.authenticatedStore.setState(true);
        } else {
          this.authenticatedStore.setState(false);
        }
      });
  }

  public userStoreObservable(): Observable<IUser> {
    return this.userStore.state$;
  }

  public setUser(user: IUser): void {
    this.userStore.setState(user);
  }

  public authenticatedStoreObservable(): Observable<Boolean> {
    return this.authenticatedStore.state$;
  }
}
