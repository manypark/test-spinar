import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from "firebase/database";

import { Tareas } from './interfaces';
import { environment } from 'src/environments/environment';
@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.css']
})

export class AppComponent implements AfterContentInit {

  title = 'test-spinar';
  tareas:Tareas[] = [];
  form:FormGroup;

  displayedColumns: string[] = [ 'id', 'title', 'desc' ];
  dataSource: MatTableDataSource<Tareas>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  app = initializeApp(environment.firebaseConfig);
  database = getDatabase(this.app);

  constructor(
    private fb:FormBuilder
  )
  {
    this.form = this.fb.group({
      title : ['', [ Validators.required ]],
      desc  : ['', [ Validators.required ]]
    });
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.tareas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.readTareas();
    }, 100);
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
        this.tareas.push(t.val());
      });

      this.dataSource.data = [];
      this.dataSource.data = this.tareas;
    });
  }

  async saveTarea() {

    if(this.form.invalid) return;

    try {
      set(ref(this.database, 'tareas/' + uuidv4()), {id:uuidv4().split('-')[0], ...this.form.value});
      this.form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}
