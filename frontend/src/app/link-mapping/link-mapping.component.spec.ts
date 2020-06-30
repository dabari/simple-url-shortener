import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMappingComponent } from './link-mapping.component';

describe('LinkMappingComponent', () => {
  let component: LinkMappingComponent;
  let fixture: ComponentFixture<LinkMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
