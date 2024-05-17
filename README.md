# ShortURL

## Prérequis

- Clonez le projet

```shell
git clone git@github.com:samuelfaberdev/ShortURL.git ShortURL
```

- Créez un fichier `.env` à la racine du projet, dans le backend et dans le frontend

```shell
cp .env.sample .env
cd backend
cp .env.sample .env
cd ../frontend
cp .env.sample .env
```

- Renseignez les variables d'environnement

## Lancement du mode développement

```shell
docker compose -f docker-compose.dev.yml up --build
```
