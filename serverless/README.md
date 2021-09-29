# Magic Pixel Serverless

This project is the monorepo for the Magic Pixel application.

## Source

Source is hosted on GitLab in a private repo [bflannery/magic-pixel](https://github.com/bflannery/magic-pixel)


## Technology

The backend is hosted on AWS lambda load balanced and triggered through API Gateway.
Data is stored in a postgres db.
Cloud configuration and deployment is managed by [The Serverless Framework](https://www.serverless.com/)

## Development

### Barebones System Requirements:
- `python3.7` (backend runs on it)
- `pip` (python dependency management)
- `nodejs` (most tooling, v14.17.3 is last tested version)
- `npm` (node dependency management, installed w/ node)
- `postgres`
- `git`

### Install tooling

#### Python Env

All our lambda's run python 3.7, most OS's come with a version of python but it is important to install
this specify version. Since you probably don't want to override the global version of python3 to python3.7
you will have to be able to support more than one python3 on your computer.

For MacOS, you most likely need to use [`pyenv`](https://github.com/pyenv/pyenv)
For most linux distros, might support installing more than one version of python

For Mac: install pyenv?
for linux: install python3.7

This should include pip for you


#### NodeJS
All our tooling has been tested with node v14.17.3. probably could use other versions, but no guarantee.
Recommend using `nvm` to manage node versions.

#### Postgres
We use docker to isolate the local instances of postgres.
You will probably want to install postgres on your host as well for command line tools.

[install docker](https://docs.docker.com/get-docker/)
If on linux: install [docker-compose](https://docs.docker.com/compose/install/) (comes w/ docker install for for MacOS)
and later we will automatically create the containers needed for local dev

Also install postgres locally for tooling.
For Mac, it's recommend to use postico as an easy ui for postgres


### Repo Setup

Get access to gitlab repo
ssh is recommended so [add a new ssh key to your github account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
you'll need ssh for prod db access as well

### Clone the repo!
ssh (recommended): `git@github.com:bflannery/magic-pixel.git`
https: `https://github.com/bflannery/magic-pixel.git`

#### Setup a venv for deps
In root of project
If using pyenv, install python3.7 and verify version is 3.7 w/ `python --version`
If not, run commands below w/ specific version of python `python3.7` or `/path/to/python3.7`
- `python -m venv .venv`.
This will make a virtual environment under .venv directory
- `source ./.venv/bin/activate`.
You will have to activate the environment for evey shell you want to run project commands in.
There are some scripts out there to automatically change venv's when you `cd` to the project.
To deactivate the virtualenv and go back to system python/packages just run `deactivate`


### Install deps
- `npm install`
- `pip install -r requirements-dev.txt`
- `npm install -g serverless@1.51` optional. can use `npx` command instead


### Setup local docker Postgres DB
- `mkdir -p $HOME/docker/volumes/postgres/pixel`
- `mkdir -p $HOME/docker/volumes/postgres/pixel-test`
- `docker compose up`
creates two postgres docker containers, one for local, one for tests


### Start local development server

- `npm start`

## Helpful Commands

### Deploy to production

- `./ops/deploy.sh`

### Create a migration version

- `IS_OFFLINE=True flask db migrate -m "<message>"`

### Upgrade local database to latest migrations

- `IS_OFFLINE=True flask db upgrade`

### Downgrade production db

- `ENV=production flask db downgrade`
