# Magic Pixel Event Tracker Service

This project is a microservice for Magic Pixel event tracking.

## Technology
- The backend is a serverless wsgi flask application hosted on AWS lambda, load balanced, and triggered through API Gateway.
- Data is stored in AWS RDS on a postgres db.
- Cloud configuration and deployment is managed by [The Serverless Framework](https://www.serverless.com/)
- SQS pipelines for streaming event ingestion

## Development

### Barebones System Requirements:
- `python3.9` (backend runs on it)
- `pip` (python dependency management)
- `pip-tools` (tooling for pip)
- `nodejs` (frontend runs on it, v14.17.3 is last tested version)
- `npm` (node dependency management, installed w/ node)
- `postgres`
- `git`

### Gitlab Repo Setup
The repo is hosted on Gitlab. You'll need to set up a new gitlab account and get access to the repo. An engineer can help
get access. You'll also want to add your [ssh key](https://docs.gitlab.com/ee/gitlab-basics/create-your-ssh-keys.html)
to your gitlab account.

- If you don't have a ssh rsa key
  [generate a new ssh key pair](https://docs.gitlab.com/ee/ssh/index.html#generate-an-ssh-key-pair).
- With your existing ssh rsa key or with your newly generated one,
  [add the ssh key to your gitlab account](https://docs.gitlab.com/ee/ssh/index.html#generate-an-ssh-key-pair).


#### Clone the repo!

- Create new folder on your machine for event-tracker repo
- In a new terminal window from root of folder for event-tracker repo,
  run the following command to clone the repo:
  ```
  git@gitlab.com:magic-pixel/event-tracker.git
  ```

### Install tooling

#### Python Env
All our lambda's run python 3.9, most OS's come with a version of python, but it is important to install
this specific version. Since you probably don't want to override the global version of python3 to python3.9
you will have to be able to support more than one python3 on your computer.

#### Installing pyenv for macOS
For MacOS, if you don't already have a python version manager, the following will walk-through setting up
[pyenv](https://github.com/pyenv/pyenv) as your default python version manager.

- If not already installed, you'll need to install [Homebrew](brew.sh). Copy and paste the following into a new terminal shell.
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
- Once installed, go ahead and install pyenv by entering the following command in terminal
    ```
    brew install pyenv
    ```
- Once installed you should see an output prompt that includes a command to add to a `~/.zshrc` file. Copy and paste
  the following command to either add/edit the file and add the pyenv init command.
    ```
    echo 'eval "$(pyenv init -)"' >> ~/.zshrc
    ```
- Exit and restart terminal for changes to take effect
- In a new terminal window, enter `pyenv versions` and it should output `system` only
- To install python 3.7, enter the following command `pyenv install 3.7.10`
- Once installed, verify new installation was successful by entering `pyenv versions` again and now there should be a
  3.7.10 version. ***Note: this does not change or set your python version yet.***

  
#### NodeJS
Most recently tested node version: v14.17.3

- If not already installed, you'll need to install [nvm](https://github.com/nvm-sh/nvm) to manage multiple node versions
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
- Once installed, the following command should have been added to your `~/.zshrc` file. Verify it's there and if not,
  add it and save the file.

    ``` 
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    ```
- Exit and restart terminal for changes to take effect
- To install a specific version of node enter the following command in a new terminal
    ```
    nvm install 14.17.3
    ```
- Once installed, enter the following command to use a specific version of node
    ``` 
    nvm use 14.17.3
    ```

#### Postgres
We use docker to isolate the local instances of [postgres](https://www.postgresql.org/).

- For macOS:
    - Install [Docker](https://docs.docker.com/get-docker/)
- Install postgres locally for tooling
    - On macOS, enter the following command
      ```
       brew install postgres
       ```
    - On linux?
- Install [Postico](https://eggerapps.at/postico/) as for Postgres UI. We have a license for this.

#### Setup a virtual environment for python dependencies
- From `event-tracker/`, enter the following command to set a venv if using pyenv
    ``` 
     /path/to/python3.9 -m venv .venv
    ```

  ***Note: pyenv saves versions in `~/.pyenv/versions` folder. When adding the path to the above command,
  it should look like `/.pyenv/versions/<installed_version>/bin/python -m venv .venv`***
- If setup correctly, there should be a new folder named `.venv` in the `event-tracker/`
- To activate the python environment, enter the following command from `event-tracker/`
    ```
    source ./.venv/bin/activate
    ```
  ***Note: With `pyenv` you will need to activate a new python environment every time you open a new terminal window.
  There are libraries out there like `direnv` that does this for you but that is outside the scope of basic setup.***

#### Install Serverless dependencies
- From `event-tracker/`, enter the following command: `npm install`
- Optional: Install serverless framework globally on your machine with the following command: `npm install -g serverless@1.51`

#### Install Python dependencies
- From `event-tracker/`, active your python env
- Once activated, enter the following command to install dev and prod requirements:
  ```
  pip install -r dev-requirements.txt
  ```

#### Install Node dependencies
- From `event-tracker/client`, enter the following command: `npm install`

### Connecting to remote databases
TODO: Once live, we will update with seed instruction

### Seed local DB from remote database
TODO: Once live, we will update with seed instruction

### Connecting to local DB via Docker
- In a new terminal window, enter the following command to create a new docker volume directory for the local postgres DB.
  ```
  mkdir -p $HOME/docker/volumes/postgres
  ```
- From `event-tracker/` enter the following command to start the local and test containers:
   ```
   docker-compose up
   ```
- Docker configuration is in the `event-tracker/docker-compose.yaml` file.
- Open Postico, and select "New Favorite" form the bottom left corner.
- Add DB Credentials
    - Configs for DB can be found in env specific config files in `event-tracker/config.<env>.py`
    - Fill out the postico fields for Host, User, Password, Database from env config file
- Click Connect button in the bottom right
- You should be able to connect and see and empty DB. We still need to seed the database from aws
- ***Note: You may want to install postgres on your host as well for command line tools. (Optional)***


### Start local backend development server
- From `event-tracker/`, if not activated, activate your python environment
- Enter the following command to start the local serverless wsgi server on port 5001
  ```
  npm run start:offline
  ```
- ***Note: Hot reload is enabled, so your server will restart on changes by default***


### Running Backend Tests
We use pytest for our test suite and tests can be found in `event-tracker/tests` folder.

- If not running, start docker to get the test db running.
    - ***Note: `docker compose up` will start both local and local test db by default***
- From `event-tracker/`, If not activated, activate python environment
- From `event-tracker/`, run the following command to run the backend test suit:
  ```
  npm test
  ```

## Success!
Look at you, you did it! Congratulations, you are now ready to get started. You should now be able to:
- Run Postres db via docker
- Seed a local db from a remote db
- Connect to local, dev, and prod env dbs
- Run backend local environment
- Run backend test suite

## Common and Helpful Commands for Development

### Deploy to production
***Note: Should only be used by engineers with access to deploy outside Gitlab CI pipeline***
```
./ops/deploy.sh
```

### Database Management

#### Create a migration version
Flask-Migrate uses Alembic to handle database migrations. The following command will auto-generate a new local migration file.
This file will generate suggested changes which should be reviewed/removed if not related to current migration changes.
***Note: This does not update your DB***

```
IS_OFFLINE=True flask db migrate -m "<message>"
```

#### Upgrade local database to latest migrations
Once a mew migration file has been added, use the following command to run the migration to upgrade your local database.

```
IS_OFFLINE=True flask db upgrade
```

#### Downgrade local database to previous migration
To revert or downgrade a migration, enter the following command:

```
IS_OFFLINE=True flask db downgrade
```