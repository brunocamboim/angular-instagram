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
                            //finaliza��o do processo
                            this.progresso.status = 'conclu�do'
                            
                        }
                    )

            })

        
        
    }

    public consultaPublicacoes(emailUsuario: string): Promise<any> {

        return new Promise((resolve, reject) => {
            //consultar publicacoes e url das imagens no firebase
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any) => {
                let publicacoes: Array<any> = [];
                
                snapshot.forEach((childSnapshot:any) => {
                    
                    let publicacao = childSnapshot.val()
                    publicacao.key = childSnapshot.key

                    publicacoes.push(publicacao)
                    
                });

                return publicacoes.reverse()

            })
            .then((publicacoes: any) => {
                
                publicacoes.forEach((publicacao) => {

                    //consultar a url da imagem
                    firebase.storage().ref()
                    .child(`imagens/${publicacao.key}`)
                    .getDownloadURL()
                    .then((url:string) =>{

                        publicacao.url_imagem = url

                        //consultar o nome do usuario da publicacao
                        firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                            .once('value')
                            .then((snapshot:any) => {

                                publicacao.nome_usuario = snapshot.val().nome_usuario

                            })
                    })
                })

                resolve(publicacoes)
                
            })
        })
        
    }
}