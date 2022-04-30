# Magic Pixel

This application is the initial browser script for Magic Pixel services. The javascript file is initialized on client
page load. Once initialized, the script will verify the account status of the site using the Magic Pixel service. Once 
authenticated, user context is stored in the browser for other services to use.

## Technology
- Typescript
- Rollup for building application
- Prettier and ESlint for code quality
- Docker for serving file for local development


### Basic System Requirements:
- `nodejs` (most tooling and FE build)
- `npm` (node dependency management, installed w/ node)

### Gitlab Repo Setup
The repo is hosted on Gitlab. You'll need to set up a new gitlab account and get access to the repo. An engineer can help
get access. You'll also want to add your [ssh key](https://docs.gitlab.com/ee/gitlab-basics/create-your-ssh-keys.html)
to your gitlab account.

- If you don't have a ssh rsa key
  [generate a new ssh key pair](https://docs.gitlab.com/ee/ssh/index.html#generate-an-ssh-key-pair).
- With your existing ssh rsa key or with your newly generated one,
  [add the ssh key to your gitlab account](https://docs.gitlab.com/ee/ssh/index.html#generate-an-ssh-key-pair).


#### Clone the repo!

- Create new folder on your machine for the magic pixel repo 
- In a new terminal window from root of folder for  magic pixel repo, run the following command to clone the repo:
  ```
  git@gitlab.com:magic-pixel/magic-pixel.git
  ```

### Install tooling

#### NodeJS

Recommend using `nvm` to manage node versions
Most recently tested node version: v14.17.3

#### Docker
In production, the magic pixel build is hosted from s3. At the moment we use docker to serve the script for local development.

- For macOS:
  - Install [Docker](https://docs.docker.com/get-docker/)


### Running local env
- In a new terminal window, from root of project, run `docker compose up`
- Reference `docker-compose.yml` for configuration