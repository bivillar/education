# BlockBottle

Este é um projeto da matéria INF1305 da PUC-Rio, desenvolvido durante o período 19.1. Ele se resume em uma solução para o ratreamento de garrafas plásticas em hyperledger fabric.
Existem 5 métodos disponíveis na rede:
* Listar todas as garrafas;
* Buscar uma garrafa por ID;
* Adicionar uma garrafa;
* Trocar o dono de uma garrafa;
* Trocar uma garrafa para usada.

## Antes de rodar

Para a execução do projeto, é necessário ter instalado em sua máquina:
* Docker
* NodeJs
* Go

Para que o programa funcione de forma correta, o node precisa estar na versão 8. Caso tenha instalado outra versão, recomendo a utilização do [NVM](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/).

## Rodando

Entre na pasta tuna-app e rode o comando
```
./startFabric.sh
```

Cada vez que fizer alguma alteração na chaincode, rode

```
./restartFabric.sh
```

## Autores

* **Bianca Villar** - [bivillar](https://github.com/bivillar)

(Veja também a lista de [contribuidores](https://github.com/bivillar/education/graphs/contributors) que participaram do projeto utilizado de referência tuna-app)

