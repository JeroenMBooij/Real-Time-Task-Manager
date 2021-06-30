import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockSprintService } from 'src/app/mocks/sprint-service.mock';
import { done } from 'src/app/models/constants/userstory.constants';
import { ISprint } from 'src/app/models/sprint';
import { IUserstory } from 'src/app/models/userstory';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { MaterialModule } from '../shared/modules/material/material.module';
import { ReactiveModule } from '../shared/modules/reactive/reactive.module';

import { BurndownchartComponent } from './burndownchart.component';

describe('BurndownchartComponent', () => {
  let component: BurndownchartComponent;
  let fixture: ComponentFixture<BurndownchartComponent>;
  let emailField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let passwordRepeatField: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurndownchartComponent ],
      providers: [
            { provide: SprintService, useClass: MockSprintService },
            { provide: ActivatedRoute, useValue: { params: of({id: 123}) } }
        ],
      imports: [
        MaterialModule, 
        ReactiveModule
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurndownchartComponent);
    component = fixture.componentInstance;

    emailField = fixture.debugElement.nativeElement.querySelector('#emailField');
    passwordField = fixture.debugElement.nativeElement.querySelector('#passwordField');
    passwordRepeatField = fixture.debugElement.nativeElement.querySelector('#passwordRepeatField');
    
    fixture.detectChanges();
    
  });

  it("should not return true when dates aren't equal", () => {
    //arrange
    let dateOne = new Date('1984-01-01');
    let dateTwo = new Date('1914-01-01');
    //act
    fixture.detectChanges();

    //assert
    expect(component.isEqualdates(dateOne, dateTwo)).toBeFalse();
  });
  it("should return true when dates are equal", () => {
    //arrange
    let dateOne = new Date('1984-01-01');
    let dateTwo = new Date('1984-01-01');
    //act
    fixture.detectChanges();

    //assert
    expect(component.isEqualdates(dateOne, dateTwo)).toBeTrue();
  });

  it("should return all dates between two dates", () => {
    //arrange
    let dateOne = new Date('1984-01-01');
    let dateTwo = new Date('1984-01-10');
    let expectedDates = [];
    expectedDates.push(new Date('1984-01-01'));
    expectedDates.push(new Date('1984-01-02'));
    expectedDates.push(new Date('1984-01-03'));
    expectedDates.push(new Date('1984-01-04'));
    expectedDates.push(new Date('1984-01-05'));
    expectedDates.push(new Date('1984-01-06'));
    expectedDates.push(new Date('1984-01-07'));
    expectedDates.push(new Date('1984-01-08'));
    expectedDates.push(new Date('1984-01-09'));
    expectedDates.push(new Date('1984-01-10'));

    //act
    fixture.detectChanges();
    let returnDates = component.getDates(dateOne, dateTwo);
    
    let arraysEqual = false;
    for (let i = 0; i < returnDates.length; i++) {
      const returnDateOne = returnDates[i];
      if(expectedDates.filter(expectedDateTwo => component.isEqualdates(expectedDateTwo, returnDateOne)).length > 0)
        arraysEqual = true;
      else {
        arraysEqual = false;
        break;
      }
    }

    //assert
    expect(returnDates.length === expectedDates.length).toBeTrue();
    
    expect(arraysEqual).toBeTrue();
  });

  it("should return null when no stories available", () => {
    //arrange

    //act
    fixture.detectChanges();
    let returnDates = component.GetSprintDates(null, null);

    //assert
    expect(returnDates).toBeNull();
  });
  
  it("should return all dates with remaining storypoint between two dates", () => {
    //arrange
    let dateOne = new Date('1984-01-01');
    let dateTwo = new Date('1984-01-10');
    let expectedSprintDates = [];
    expectedSprintDates.push({x: new Date('1984-01-01'), y: 2});
    expectedSprintDates.push({x: new Date('1984-01-02'), y: 2});
    expectedSprintDates.push({x: new Date('1984-01-03'), y: 2});
    expectedSprintDates.push({x: new Date('1984-01-04'), y: 2});
    expectedSprintDates.push({x: new Date('1984-01-05'), y: 1});
    expectedSprintDates.push({x: new Date('1984-01-06'), y: 0});
    expectedSprintDates.push({x: new Date('1984-01-07'), y: 0});
    expectedSprintDates.push({x: new Date('1984-01-08'), y: 0});
    expectedSprintDates.push({x: new Date('1984-01-09'), y: 0});
    expectedSprintDates.push({x: new Date('1984-01-10'), y: 0});
    let mockStories : IUserstory[] = []
    mockStories.push({
      id: '1',
      name: 'story1',
      location: 'none',
      description: 'mock',
      storypoints: 1,
      completedDate: expectedSprintDates[4].x,
      status: done,
      assignee: 'mock'
    });
    mockStories.push({
      id: '1',
      name: 'story1',
      location: 'none',
      description: 'mock',
      storypoints: 1,
      completedDate: expectedSprintDates[5].x,
      status: done,
      assignee: 'mock'
    });
    let mocksprint = {
      id: '1',
      startDate: dateOne.toString(),
      endDate: dateTwo.toString(),
      owner: 'mock',
      name: 'mocksprint',
      description: 'mock',
      isCurrentSprint: true
    }

    //act
    fixture.detectChanges();
    let returnDates = component.GetSprintDates(mocksprint, mockStories);
    
    let arraysEqual = false;
    for (let i = 0; i < returnDates.length; i++) {
      const returnDateOnePointsOne = returnDates[i];
      if(expectedSprintDates.filter(expectedDateTwo => 
        component.isEqualdates(expectedDateTwo.x, returnDateOnePointsOne.x)
        && expectedDateTwo.y === returnDateOnePointsOne.y
        ).length > 0)
        arraysEqual = true;
      else {
        arraysEqual = false;
        break;
      }
    }
    
    //assert
    expect(returnDates.length === expectedSprintDates.length).toBeTrue();
    
    expect(arraysEqual).toBeTrue();
  });
  it("should return the ideal dates and storypoints between two dates", () => {
    //arrange
    component.useStoryPoints = true;
    let dateOne = new Date('1984-01-01');
    let dateTwo = new Date('1984-01-10');
    let expectedSprintDates = [];
    expectedSprintDates.push({x: new Date('1984-01-01'), y: 9});
    expectedSprintDates.push({x: new Date('1984-01-02'), y: 8});
    expectedSprintDates.push({x: new Date('1984-01-03'), y: 7});
    expectedSprintDates.push({x: new Date('1984-01-04'), y: 6});
    expectedSprintDates.push({x: new Date('1984-01-05'), y: 5});
    expectedSprintDates.push({x: new Date('1984-01-06'), y: 4});
    expectedSprintDates.push({x: new Date('1984-01-07'), y: 3});
    expectedSprintDates.push({x: new Date('1984-01-08'), y: 2});
    expectedSprintDates.push({x: new Date('1984-01-09'), y: 1});
    expectedSprintDates.push({x: new Date('1984-01-10'), y: 0});
    let mockStories : IUserstory[] = []
    mockStories.push({
      id: '1',
      name: 'story1',
      location: 'none',
      description: 'mock',
      storypoints: 9,
      completedDate: expectedSprintDates[4].x,
      status: done,
      assignee: 'mock'
    });
    let mocksprint = {
      id: '1',
      startDate: dateOne.toString(),
      endDate: dateTwo.toString(),
      owner: 'mock',
      name: 'mocksprint',
      description: 'mock',
      isCurrentSprint: true
    }

    //act
    fixture.detectChanges();
    let returnDates = component.GetIdealLine(mocksprint, mockStories);

    let arraysEqual = false;
    for (let i = 0; i < returnDates.length; i++) {
      const returnDateOnePointsOne = returnDates[i];
      if(expectedSprintDates.filter(expectedDateTwo => 
        component.isEqualdates(expectedDateTwo.x, returnDateOnePointsOne.x)
        && expectedDateTwo.y === returnDateOnePointsOne.y
        ).length > 0)
        arraysEqual = true;
      else {
        arraysEqual = false;
        break;
      }
    }

    //assert
    expect(returnDates.length === expectedSprintDates.length).toBeTrue();
    
    expect(arraysEqual).toBeTrue();
  });
  it("should null when sprints and stopries are null or undefined", () => { //null check
    //arrange
    let mocksprint: ISprint = null;
    let mockStories : IUserstory[] = undefined;

    //act
    fixture.detectChanges();
    let returnDates = component.GetSprintDates(mocksprint, mockStories);

    //assert
    expect(returnDates === null).toBeTrue();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
