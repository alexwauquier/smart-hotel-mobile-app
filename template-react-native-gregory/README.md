# Template React-native

Ce template est une application React Native qui utilise une API distante.
Le but ici est de forker ce projet afin d'avoir une base fonctionnelle pour une application mobile utilisant une API via APIPlatform.

## Pré-requis

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/en) installé sur votre ordinateur.
2. Installez ExpoGo sur votre smartphone pour pouvoir visualiser vos différentes modifications.

## Installation du projet

- Forkez ce projet et clonez le dans un dossier.
- Un dossier nommé *template-react-native* devrait alors se créer avec toute l'arborescence du projet.
- Lancez la commande suivante :
```bash
npm install
```
- Cette commande permet d'installer dans votre projet toutes les dépendances existantes dans le fichier *package.json*
- Créez un fichier *.env.local*.
- Se fichier contiendra toutes les informations secrète de notre application *(Token, URL privées, identifiants de connexion etc...)*
- Dans ce fichier, renseignez :
```bash
API_URL=http://votre_ip:votre_port
```
<small>Où votre_ip est votre IP locale (trouvable avec la commande ipconfig ou ifconfig) et votre_port le port de votre serveur.</small>

- Pour lancer votre application utilisez
```bash
npx expo start --tunnel --clear
```
<small>Cette commande va permettre de lancer le front de l'application via un QRCode. Le --tunnel sert pour accéder à votre application en dehors de votre réseau.</small>

