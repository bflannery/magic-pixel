# Magic Pixel

This project is the monorepo for the Magic Pixel application.

## Source

Source is hosted on Github in a private repo [bflannery/magic-pixel](https://github.com/bflannery/magic-pixel)


## Technology

The backend is hosted on AWS lambda load balanced and triggered through API Gateway.
Data is stored in a postgres db.
Cloud configuration and deployment is managed by [The Serverless Framework](https://www.serverless.com/)

### Repo Setup

Get access to gitlab repo
ssh is recommended so [add a new ssh key to your github account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
you'll need ssh for prod db access as well

### Clone the repo!

ssh (recommended): `git@github.com:bflannery/magic-pixel.git`
https: `https://github.com/bflannery/magic-pixel.git`

[install docker](https://docs.docker.com/get-docker/)
If on linux: install [docker-compose](https://docs.docker.com/compose/install/) (comes w/ docker install for for MacOS)
and later we will automatically create the containers needed for local dev

Also install postgres locally for tooling.
For Mac, it's recommend to use postico as an easy ui for postgres


#### Postgres

We use docker to isolate the local instances of postgres.
You will probably want to install postgres on your host as well for command line tools.

### Setup local docker Postgres DB
- `mkdir -p $HOME/docker/volumes/postgres/pixel`
- `mkdir -p $HOME/docker/volumes/postgres/pixel-test`
- `docker compose up`
  creates two postgres docker containers, one for local, one for tests



