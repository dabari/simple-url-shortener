import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { NgForm, NgModel, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { LinkMappingService } from "../link-mapping.service";
import { EventManagerService } from "../event-manager.service";

@Component({
  selector: "app-link-mapping",
  templateUrl: "./link-mapping.component.html",
  styleUrls: ["./link-mapping.component.css"],
})
export class LinkMappingComponent implements OnInit {
  linkMappingData: ILinkMapping[] = [];
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
      (res: ILinkMapping[]) => {
        this.linkMappingData = res;
      },
      (err) => this.broadcastError(err)
    );
  }

  addLinkMapping(form: NgForm) {
    this.resetErrors();
    const data: ILinkMapping = {
      id: null,
      shortLink: this.shortLink,
      targetUrl: this.targetUrl,
    };
    this.linkMappingService.store(data).subscribe(
      (res: ILinkMapping[]) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Created successfully");
        // Reset the form
        form.reset();
      },
      (err) => this.broadcastError(err)
    );
  }

  updateLinkMapping(id: number, shortLink: string, targetUrl: string) {
    this.resetErrors();
    const data: ILinkMapping = {
      id: id,
      shortLink: shortLink,
      targetUrl: targetUrl,
    };
    this.linkMappingService.update(data).subscribe(
      (res: ILinkMapping[]) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Updated successfully");
      },
      (err) => this.broadcastError(err)
    );
  }

  deleteLink(id: number) {
    this.resetErrors();

    this.linkMappingService.delete(id).subscribe(
      (res: ILinkMapping[]) => {
        this.linkMappingData = res;
        this.broadcastSuccess("Deleted successfully");
      },
      (err) => this.broadcastError(err)
    );
  }

  onShortLinkChange(id: number, model: NgModel) {
    const value = model.value;
    const formControl: FormControl = model.control;

    if (this.linkMappingData && this.existsShortLink(id, value)) {
      formControl.setErrors({ linkExists: true });
    }
  }

  private existsShortLink(id: number, value: string){
    const result = this.linkMappingData.filter(x => {
      return x.shortLink === value && x.id !== id;
    });
    return result.length > 0;
  }

  hasItems(): boolean {
    if (this.linkMappingData) {
      return this.linkMappingData.length > 0;
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
