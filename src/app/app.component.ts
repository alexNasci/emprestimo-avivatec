import { Component } from '@angular/core';
import { EmprestimoService } from './services/emprestimo-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import toastr from "toastr";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EMPRESTIMO';
  exibirFormSolicitacao: boolean = false
  itensOutroValor: any[] = []
  valorSelecionado: number;
  outroValor: boolean;
  formSolicitacao: FormGroup 
  loading: boolean = false
  cabecalho: boolean = true

  constructor (
    private emprestimoService: EmprestimoService
  ){}

  ngOnInit() {
    this.formSolicitacao = new FormGroup ({
      'valor': new FormControl (),
      'nome': new FormControl ('', [Validators.required, Validators.minLength(3)]),
      'email': new FormControl ('', [Validators.required, Validators.email]),
      'comentario': new FormControl ('', [Validators.required, Validators.minLength(10)])
    });
  }

  formularioSolicitacao(valor) {
    this.loading = true
    if(valor != null) {
      this.itensOutroValor.push({'cor' : '#FFD700' , 'valor' : valor})
      this.formSolicitacao.patchValue({
        valor: valor
      })
      this.exibirFormSolicitacao = true
      this.loading = false
    }else{
      this.buscarValores()
    }   

  }

  buscarValores(){
    this.emprestimoService.getAll()
      .subscribe(
        (itens) => {
          this.itensOutroValor = itens.sort(function(a, b) {
            if (a.valor > b.valor) {
              return 1;
            }
            if (a.valor < b.valor) {
              return -1;
            }
            return 0;
          })
          this.formSolicitacao.patchValue({
            valor: this.itensOutroValor[0].valor
          })
          this.outroValor = true
          this.exibirFormSolicitacao = true
          this.loading = false
        },
        (erro) => { 
          console.log(erro)
          this.loading = false
        }
    )  
  }

  enviarEmprestimo() {
    this.emprestimoService.enviarEmprestimo(
      this.formSolicitacao.value.nome, 
      this.formSolicitacao.value.email, 
      this.formSolicitacao.value.comentario, 
      this.formSolicitacao.value.valor)

    this.formSolicitacao.reset
    this.exibirFormSolicitacao = false
    toastr.success("Solicitação enviada com sucesso!");
  }

  voltar(){
    this.formSolicitacao.reset
    this.exibirFormSolicitacao = false;
    this.itensOutroValor = []
  }

}
