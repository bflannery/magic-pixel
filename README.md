# Magic Pixel

This project is the monorepo for the Magic Pixel application.

## Source

Source is hosted on Github in a private repo [bflannery/magic-pixel](https://github.com/bflannery/magic-pixel)


## Technology

The backend is hosted on AWS lambda load balanced and triggered through API Gateway.
Data is stored in a postgres db.
Cloud configuration and deployment is managed by [The Serverless Framework](https://www.serverless.com/)

### Basic System Requirements:
- `python3.7` (backend runs on it)
- `pip` (python dependency management)
- `nodejs` (most tooling and FE build)
- `npm` (node dependency management, installed w/ node)
- `postgres`
- `git`

### Install tooling

#### Python Env

All our lambda's run python 3.7, most OS's come with a version of python, but it is important to install
this specific version. Since you probably don't want to override the global version of python3 to python3.7
you will have to be able to support more than one python3 on your computer.

For MacOS, you most likely need to use [`pyenv`](https://github.com/pyenv/pyenv)
For most linux distros, might support installing more than one version of python

#### NodeJS

Recommend using `nvm` to manage node versions
Most recently tested node version: v14.17.3

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

### Running local env
- Start Docker 
  - Will start postgres db, mock sqs-pipeline server (ElasticMQ), and a test website 
    - In a new terminal window, from root of project, run `docker compose up`
    - Reference `docker-compose.yml` for configuration
- Start Serverless Backend
  - Will start serverless offline backend flask app, sqs-pipelines, and lambda functions
  - In a new terminal window, navigate to serverless directory by running `cd ./serverless` from root directory
  - Activate python env with `source venv/bin/activate`
  - Start serverless env by running `npm run start:offline`
  - Reference Files for configuration:
    - `./serverless/serverless.yml`
    - `./serverless/config`
    - `./serverless/package.json` 
- Start Serverless Frontend Client
  - Will start Typescript React app 
  - In a new terminal window, navigate to serverless client by running `cd ./serverless/client` from root directory
  - Start client env by running `npm run start`
- Start Web Tracker
  - Will start hot reload for change to the tracking script
  - In a new terminal window, navigate to website-tracker by running `cd ./website-tracker` from root directory
  - Start watching tracker by running `npm run start`
