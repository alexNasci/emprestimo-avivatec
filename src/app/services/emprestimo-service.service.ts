import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {

  constructor(
     private http: HttpClient
  ) { }

  public getAll(): Observable<any[]> {

    return this.http.get(`https://apifront.azurewebsites.net/api/front`).pipe(
      catchError(this.handlerError));
  }
  
  public enviarEmprestimo(nome,email,comentario,valor): void{
    localStorage.removeItem('nome')
    localStorage.removeItem('email')
    localStorage.removeItem('comentario')
    localStorage.removeItem('valor')

    localStorage.setItem('nome', nome)
    localStorage.setItem('email', email)
    localStorage.setItem('comentario', comentario)
    localStorage.setItem('valor', valor)
  }

  private handlerError(error: any): Observable<any>{
    console.log("Erro na requisição => ", error);
    return throwError(error)
  }
}
