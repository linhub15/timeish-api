import { Component, OnInit, ViewChildren, QueryList, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { TimeSheet } from '../../models/time-sheet.model';
import { ActivatedRoute } from '@angular/router';
import { TimeSheetsService } from '../time-sheets.service';
import { ActivityComponent } from '../activity/activity.component';
import { Activity } from 'src/app/models/activity.model';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css']
})
export class TimeSheetComponent implements OnInit {

  submitted: boolean;
  timeSheet: TimeSheet;

  @ViewChildren('activities') activities: QueryList<ActivityComponent>;
  
  constructor(
    private route: ActivatedRoute,
    private apiService: TimeSheetsService,
  ) { }

  ngOnInit() {
    this.submitted = false; // TODO: Get this from the database
    this.getTimeSheet();
  }
  getTimeSheet(): void {
    // the (+) operator converts string to number
    const id: number = +this.route.snapshot.paramMap.get('id');
    this.apiService.getTimeSheet(id).subscribe(timeSheet => {
      this.timeSheet = new TimeSheet().deserialize(timeSheet);
      if (!this.timeSheet.hasActivities()) { this.timeSheet.addActivity() }
    });
  }

  addActivity() {
    this.timeSheet.addActivity();
  }

  deleteActivity(activityId: number) {
    // Removes the activity component from the view
    let index = this.timeSheet.activities
        .findIndex(activity => activity.id == activityId)
    this.timeSheet.activities.splice(index, 1);

    // "Add Activity" doesn't insert new Activity in DB
    // Can't delete what doesn't exist
    if (!activityId) { return } 
    this.apiService.deleteActivity(activityId).subscribe();
  }

  save() {
    this.apiService.putTimeSheet(this.timeSheet)
        .subscribe(timeSheet => {
          this.timeSheet.deserialize(timeSheet);
        });
  }

  submit() {
    // Are you sure you want to submit? No more changes can be made
    this.submitted = true;
    this.timeSheet.submitted = new Date();
    this.apiService.putTimeSheet(this.timeSheet).subscribe();
  }
}