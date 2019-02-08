import { Usuario } from './acesso/usuario.model'
import * as firebase from 'firebase'

export class Autenticacao {
    public cadastrarUsuario(usuario: Usuario): Promise<any> {

        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
               
                //remover senha do objeto
                delete usuario.senha

                //registrando dados complementares do usuario no path o email com base64
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set( usuario )

            })
            .catch((error: any) => {
                console.log(error)
            })
    }

    public autenticar(email: string, senha: string): void {
        
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => console.log(resposta))
            .catch((error: any) => console.log(error))
    }
}