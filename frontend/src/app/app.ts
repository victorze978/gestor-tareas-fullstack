import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { TodoService } from './services/todo'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
 
  misTareas: any[] = [];
  nuevaTarea = { title: '', description: '' };
  intervalo: any;

  
  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.obtenerTareas();
    
    // Este intervalo refresca el reloj de los segundos automáticamente
    this.intervalo = setInterval(() => {
      this.cdr.detectChanges(); 
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  // --- SECCIONES INTELIGENTES ---
  get tareasPendientes() {
    return this.misTareas.filter(t => !t.is_completed);
  }

  get tareasCompletadas() {
    return this.misTareas.filter(t => t.is_completed);
  }

  // --- MÉTODOS DE ACCIÓN ---
  obtenerTareas() {
    this.todoService.getTasks().subscribe({
      next: (data) => {
        this.misTareas = data;
        this.cdr.detectChanges(); // Forza el refresco visual inmediato
      }
    });
  }

  agregarTarea() {
    if (this.nuevaTarea.title.trim()) {
      this.todoService.addTask(this.nuevaTarea).subscribe({
        next: () => {
          this.obtenerTareas();
          this.nuevaTarea = { title: '', description: '' };
          this.cdr.detectChanges();
        }
      });
    } else {
    alert("¡La tarea necesita un título!");
  }
  }

  toggleTarea(tarea: any) {
    const nuevoEstado = tarea.is_completed ? 0 : 1;
    this.todoService.updateTask(tarea.id, { ...tarea, is_completed: nuevoEstado }).subscribe({
      next: () => {
        this.obtenerTareas();
        this.cdr.detectChanges();
      }
    });
  }

  borrarTarea(id: number) {
    if(confirm('¿Seguro que quieres borrar esta tarea?')) {
      this.todoService.deleteTask(id).subscribe({
        next: () => {
          this.obtenerTareas();
          this.cdr.detectChanges();
        }
      });
    }
  }

  calcularTiempo(fechaStr: string) {
    const fechaCreacion = new Date(fechaStr);
    const ahora = new Date();
    const difMs = ahora.getTime() - fechaCreacion.getTime();
    const difHoras = difMs / (1000 * 60 * 60);

    if (difHoras >= 24) {
      return `Creado: ${fechaCreacion.toLocaleDateString()} ${fechaCreacion.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }

    const seg = Math.floor(difMs / 1000) % 60;
    const min = Math.floor(difMs / (1000 * 60)) % 60;
    const hrs = Math.floor(difHoras);

    return `Hace: ${hrs}h ${min}m ${seg}s`;
  }
}
