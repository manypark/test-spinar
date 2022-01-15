import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TaskService } from 'src/app/services/task.service';
import { Tareas } from 'src/app/interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { ref, onValue, getDatabase, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector    : 'app-table',
  templateUrl : './table.component.html',
  styleUrls   : ['./table.component.css']
})

export class TableComponent {

  displayedColumns: string[] = [ 'select', 'id', 'title', 'desc'];
  dataSource: MatTableDataSource<Tareas>;
  tareas:Tareas[] = [];
  app = initializeApp(environment.firebaseConfig);
  database = getDatabase(this.app);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<Tareas>(true, []);

  constructor(
    public taskServices:TaskService
  ) {
    this.dataSource = new MatTableDataSource(this.tareas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    setTimeout( () => {
      this.readTareas();
    }, 300);
  }

  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async readTareas() {
    const starCountRef = ref(this.database, 'tareas/');

    onValue(starCountRef, (snapshot) => {

      this.tareas = [];      

      snapshot.forEach( t => {
        this.tareas.push({
          ref: t.ref,
          ...t.val()
        });
      });

      this.dataSource.data = [];
      this.dataSource.data = this.tareas;

    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);    
  }

  checkboxLabel(row?: Tareas): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${ row.id + 1 }`;
  }

  deleteTarea() {
    this.selection.selected.forEach( task => {
      remove( task.ref )
    });
  }

}