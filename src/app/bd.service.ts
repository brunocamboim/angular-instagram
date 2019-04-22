import { Injectable } from '@angular/core'
import * as firebase from 'firebase'
import { Progresso } from './progreso.service';

@Injectable()
export class Bd {

    constructor( private progresso: Progresso){}

    public publicar(publicacao: any): void {

        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
            .push( { titulo: publicacao.titulo } )
            .then((resposta: any) => {

                let nomeImagem = resposta.key

                firebase.storage().ref()
                    .child(`imagens/${nomeImagem}`)
                    .put(publicacao.imagem)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                        //acompanhamento do progresso do upload
                        (snapshop: any) => {
                            this.progresso.status = 'andamento'
                            this.progresso.estado = snapshop
                        },
                        (error) => {
                            this.progresso.status = 'erro'
                        },
                        () => {
                            //finalização do processo
                            this.progresso.status = 'concluído'
                            
                        }
                    )

            })

        
        
    }

    public consultaPublicacoes(emailUsuario: string): any {
        firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
            .once('value')
            .then((snapshot: any) => {
                console.log(snapshot.val())
            })
    }
}