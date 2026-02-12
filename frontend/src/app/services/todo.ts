import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/tasks'; 

  constructor(private http: HttpClient) { }

  // Método para obtener todas las tareas
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para añadir una tarea
  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  // Método para eliminar una tarea
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar una tarea
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }
  
}