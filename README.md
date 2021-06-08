# yarn-plugin-env

Yarn plugin to load `.env` files for all your yarn scripts.

- Loads `.env` files in project/workspace root for every yarn script
- Mutiple dotenv files can be specified. This is useful to actually load your `.env.example` as an overridable default
- In monorepos it loads from both the project root and the workspace
- Expands variables in the dotenv files

  ```bash
  # .env
  HOSTNAME=localhost
  PORT=8080
  API=http://$HOSTNAME:$PORT
  ```

  (escape $ with / if you want to avoid that)

## Install

```console
yarn plugin import ...
```

## Configure

Modify the `DOTENV` environment variable to specify the file name this plugin searches for. This value can even be a comma separated list of dotenv file names to look for, which is useful for having overridable files.
