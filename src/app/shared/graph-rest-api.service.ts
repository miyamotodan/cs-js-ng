import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Graph } from '../shared/graph';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GraphRestApiService {

  // Define API (mock JSON Server)
  apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch graphs list
  getGraphs(): Observable<Graph> {
    return this.http.get<Graph>(this.apiURL + '/graphs')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch graph
  getGraph(id): Observable<Graph> {
    return this.http.get<Graph>(this.apiURL + '/graphs/' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Create graph
  createGraph(graph): Observable<Graph> {
    return this.http.post<Graph>(this.apiURL + '/graphs', JSON.stringify(graph), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API put() method => Update graph
  updateGraph(id, graph): Observable<Graph> {
    return this.http.put<Graph>(this.apiURL + '/graphs/' + id, JSON.stringify(graph), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API delete() method => Delete graph
  deleteGraph(id){
    return this.http.delete<Graph>(this.apiURL + '/graphs/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}

