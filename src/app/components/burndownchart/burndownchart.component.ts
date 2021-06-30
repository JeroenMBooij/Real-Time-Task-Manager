import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { ISprint } from 'src/app/models/sprint';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { IUserstory } from 'src/app/models/userstory';
import { done } from 'src/app/models/constants/userstory.constants';
import { SprintService } from 'src/app/services/sprint/sprint.service';

@Component({
  selector: 'app-burndownchart',
  templateUrl: './burndownchart.component.html',
  styleUrls: ['./burndownchart.component.scss']
})
export class BurndownchartComponent implements OnInit, OnDestroy {
  sprint: ISprint;
  projectId: string;
  stories: IUserstory[];
  public useStoryPoints = false;

  constructor(
    private route: ActivatedRoute, 
    private sprintService: SprintService) 
    {
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });
    }
    
  private storiesSubscription: Subscription;
  private sprintSubscription: Subscription;
  async ngOnInit() {
    this.storiesSubscription?.unsubscribe();
    this.sprintSubscription?.unsubscribe();
    this.storiesSubscription = (await this.sprintService.getCurSprintStories(this.projectId))?.subscribe(stories => {
      this.stories = stories;
      if(this.sprint && this.stories)
        this.renderChart(this.sprint, this.stories);
    });
    this.sprintSubscription = this.sprintService.getCurrentSprint(this.projectId)?.subscribe(sprint => {
      this.sprint = sprint;
      if(this.sprint && this.stories)
        this.renderChart(this.sprint, this.stories);
    });
    
  }
  ngOnDestroy() {
    this.storiesSubscription?.unsubscribe();
    this.sprintSubscription?.unsubscribe();
  }

  renderChart(sprint: ISprint, stories: IUserstory[]) {
    if(this.sprint != undefined) {
      var Chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        axisX: {
          minimum: new Date(sprint.startDate),
          valueFormatString: "DD-MMM-YY"
        },
        axisY: {
          title: this.useStoryPoints ? "Storypoints" : "Stories",
          titleFontColor: "#4F81BC",
          suffix: this.useStoryPoints ? " points" : " stories"
        },
        data: [{
          indexLabelFontColor: "darkSlateGray",
          name: this.useStoryPoints ? "Ideal Points" : "Ideal stories",
          showInLegend: false,
          type: "area",
          yValueFormatString: this.useStoryPoints ? "# points" : "# stories",
          dataPoints: this.GetIdealLine(sprint, stories)
        },
        {
          type: "line",
          name: this.useStoryPoints ? "Actual points" : "Actual stories",
          showInLegend: false,
          yValueFormatString: this.useStoryPoints ? "# points" : "# stories",
          dataPoints: this.GetSprintDates(sprint, stories)
        }]
      });
      Chart.render();
    }
  }
  //returns the {x. y} object with y being the "ideal" number of storypoints at that time
  GetIdealLine(sprint: ISprint, stories: IUserstory[]) : [{x: Date,y: number}] {
    if(stories != undefined && stories.length > 0) {
      var returnValues: [{x: Date, y: number}];
      var maxPoints = 0;
      stories.forEach(story => {maxPoints += this.useStoryPoints ? story.storypoints : 1});
      var dates = this.getDates(new Date(sprint.startDate),new Date(sprint.endDate))
      var index = dates.length - 1;
      dates.forEach(date => {
        if(returnValues == undefined) returnValues = [{x: date, y: maxPoints}]
        else {
          returnValues.push({x: date, y: maxPoints / (dates.length - 1) * index})
        }
        index--;
      })
      return returnValues;
    }
    return null
  }

  //get a list of dates with the number of storypoints to be done of the sprint
  GetSprintDates(sprint: ISprint, stories: IUserstory[]) : [{x: Date,y: number}]  {
    if(stories != undefined && stories.length > 0) {
      var returnDates: [{x: Date, y: number}];
      var curPoints = 0;
      stories.forEach(story => {curPoints += this.useStoryPoints ? story.storypoints : 1});

      this.getDates(new Date(sprint.startDate),new Date(sprint.endDate)).map(date => {
        if(returnDates == undefined) returnDates = [{x: date, y: curPoints}]
        stories.forEach(story => {
          if(story.completedDate) {
            if(story.status == done && story.completedDate && this.isEqualdates(date, new Date(story.completedDate))) curPoints -= this.useStoryPoints ? story.storypoints : 1
          }
        });
        returnDates.push({x: date, y: curPoints});
      });
      returnDates.splice(0, 1); //remove initializer date
      return returnDates;
    }
    return null
  }
  isEqualdates(a: Date, b: Date) {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  }
  //returns a list of dates between the 2, offset being a day
  getDates(startDate: Date, stopDate: Date) : Date[] {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }
}
