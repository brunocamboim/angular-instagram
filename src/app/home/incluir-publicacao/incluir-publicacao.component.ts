import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Bd } from '../../bd.service'
import * as firebase from 'firebase'
import { Progresso } from 'src/app/progreso.service';
import { interval, Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators'; 
import 'rxjs';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})

export class IncluirPublicacaoComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl( null )
  })

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>()

  public email: string
  private imagem: any
  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number = 0
  
  constructor(
    private bd: Bd,
    private progresso: Progresso
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    });
 
    // para o observable
    let continua = new Subject();
    continua.next(true);

    let acompanhamentoUpload = interval(1500);

    acompanhamentoUpload.pipe(takeUntil(continua)).subscribe(() => {

      this.progressoPublicacao = 'andamento'
      this.porcentagemUpload = Math.round( (this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes ) * 100)

      if(this.progresso.status === 'concluído'){
        //emitir evento do componente parent(home)
        this.atualizarTimeLine.emit()

        continua.next(false);
        this.progressoPublicacao = 'concluido'
      }
    })

  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files
  }

}
