import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { NgForm, NgModel, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { LinkMappingService } from '../link-mapping.service';
import { EventManagerService } from '../event-manager.service';

@Component({
  selector: 'app-link-mapping',
  templateUrl: './link-mapping.component.html',
  styleUrls: ['./link-mapping.component.css']
})
export class LinkMappingComponent implements OnInit {
  linkMappingData: ILinkMapping<string>;
  shortLink = "";
  targetUrl = "";

  errorMessage = "";
  successMessage = "";

  private unsubscribe$ = new Subject();

  constructor(
    private linkMappingService: LinkMappingService,
    private eventManagerService: EventManagerService
  ) {}

  ngOnInit() {
    this.getLinkMapping();

    this.eventManagerService
      .getObservableForName("broadcastSuccess")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        this.successMessage = event.content;
      });

    this.eventManagerService
      .getObservableForName("broadcastSuccess")
      .pipe(takeUntil(this.unsubscribe$), debounceTime(3000))
      .subscribe((event) => {
        this.successMessage = "";
      });

    this.eventManagerService
      .getObservableForName("broadcastError")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        this.errorMessage = event.content;
      });

    this.eventManagerService
      .getObservableForName("broadcastError")
      .pipe(takeUntil(this.unsubscribe$), debounceTime(3000))
      .subscribe((event) => {
        this.errorMessage = "";
      });
  }

  getLinkMapping(): void {
    this.linkMappingService.getAll().subscribe(
      (res: ILinkMapping<string>) => {
        this.linkMappingData = res;
      },
      err => this.broadcastError(err)
    );
  }

  addLinkMapping(form: NgForm) {
    this.resetErrors();

    this.linkMappingService.store(this.shortLink, this.targetUrl).subscribe(
      (res: ILinkMapping<string>) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Created successfully");
        // Reset the form
        form.reset();
      },
      err => this.broadcastError(err)
    );
  }

  updateLinkMapping(shortLink: string, targetUrl: string) {
    this.resetErrors();

    this.linkMappingService.update(shortLink, targetUrl).subscribe(
      (res: ILinkMapping<string>) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Updated successfully");
      },
      err => this.broadcastError(err)
    );
  }

  deleteLink(shortLink: string) {
    this.resetErrors();

    this.linkMappingService.delete(shortLink).subscribe(
      (res: ILinkMapping<string>) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Deleted successfully");
      },
      err => this.broadcastError(err)
    );
  }

  onShortLinkChange(model: NgModel) {
    const value = model.value;
    const form: FormControl = model.control;

    if (this.linkMappingData && this.linkMappingData[value]) {
      form.setErrors({ linkExists: true });
    }
  }

  hasItems(): boolean {
    if (this.linkMappingData) {
      return Object.keys(this.linkMappingData).length > 0;
    }
    return false;
  }

  private broadcastSuccess(message: string) {
    this.eventManagerService.broadcast({
      name: "broadcastSuccess",
      content: message,
    });
  }

  private broadcastError(message: string) {
    this.eventManagerService.broadcast({
      name: "broadcastError",
      content: message,
    });
  }

  private resetErrors() {
    this.successMessage = "";
    this.errorMessage = "";
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
