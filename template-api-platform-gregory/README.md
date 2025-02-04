# Template API Platform

Ce template est une application APIPlatform pouvant se connecter à n'importe quel front.
Le but ici est de forker ce projet afin d'avoir une base fonctionnelle pour une application.

## Pré-requis

1. Assurez-vous d'avoir [MySQL](https://dev.mysql.com/downloads/installer/) installé sur votre ordinateur.
2. Assurez-vous d'avoir [Wamp](https://www.wampserver.com/) installé sur votre ordinateur.
3. Assurez-vous d'avoir [Symfony CLI](https://symfony.com/download) installé sur votre ordinateur.


## Installation du projet

- Forkez ce projet et clonez le dans un dossier.
- Un dossier nommé *template-api-platform* devrait alors se créer avec toute l'arborescence du projet.
- Lancez la commande suivante :
```bash
composer install
```
- Cette commande permet d'installer dans votre projet toutes les dépendances existantes dans le fichier *composer.json*
- Dupliquez le fichier .env et renommez le en .env.local
- Se fichier contiendra toutes les informations secrète de notre application *(Token, URL privées, identifiants de connexion etc...)*
- Dans ce fichier, renseignez décommentez la ligne touchant la connexion de la base de données MySQL et renseignez vos informations de connexion.
- Au niveau de CORS_ALLOW_ORIGIN, remplacer localhost par votre IP locale. 
<small>(trouvable avec la commande ipconfig ou ifconfig)</small>

- Executez en suite la liste de commandes suivante :
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```
Ces commandes vont créer la base de données et executer les migrations présentes en guise d'exemple.
- Lancez ensuite la commande
```bash
symfony serve --no-tls
```
afin de lancer votre serveur.

## Quelque documentations utiles
- [API Platform](https://api-platform.com/)
- [Application n-tiers](https://openclassrooms.com/fr/courses/7210131-definissez-votre-architecture-logicielle-grace-aux-standards-reconnus/7371476-apprenez-larchitecture-en-couches)
- [QueryBuilders](https://www.doctrine-project.org/projects/doctrine-orm/en/3.1/reference/query-builder.html)
- [Jointures](https://sql.sh/cours/jointures)
