import { Injectable } from "@angular/core";
import { Observable, Observer, Subscription } from "rxjs";
import { share, filter } from "rxjs/operators";

interface EventMessage {
  name: string;
  content: any;
}

@Injectable({ providedIn: "root" })
export class EventManagerService {
  observable$: Observable<EventMessage>;
  observer: Observer<EventMessage>;

  constructor() {
    this.observable$ = Observable.create((observer: Observer<EventMessage>) => {
      this.observer = observer;
    }).pipe(share());
  }

  /**
   * Method to broadcast the event to observer
   */
  broadcast(event: EventMessage) {
    if (this.observer != null) {
      this.observer.next(event);
    }
  }

  /**
   * Method to subscribe to an event with callback
   */
  subscribe(eventName: string, callback) {
    const subscriber: Subscription = this.observable$
      .pipe(
        filter((event) => {
          return event.name === eventName;
        })
      )
      .subscribe(callback);
    return subscriber;
  }

  /**
   * Method to get observable to an event with name
   */
  public getObservableForName(eventName: string): Observable<EventMessage> {
    return this.observable$.pipe(
      filter((event) => {
        return event.name === eventName;
      })
    );
  }

  /**
   * Method to unsubscribe the subscription
   */
  destroy(subscriber: Subscription) {
    subscriber.unsubscribe();
  }
}
