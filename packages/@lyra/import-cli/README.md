# @lyra/import-cli

CLI tool that imports documents from an ndjson file or URL

## Installation

```
npm install -g @lyra/import-cli
```

## Usage

```
  CLI tool that imports documents from an ndjson file or URL

  Usage
    $ lyra-import -a <api host> -d <dataset> -t <token> sourceFile.ndjson

  Options
    -a, --api <api host> API host of lyra backend
    -d, --dataset <dataset> Dataset to import to
    -t, --token <token> Token to authenticate with
    --replace Replace documents with the same IDs
    --missing Skip documents that already exist
    --help Show this help

  Examples
    # Import "./my-dataset.ndjson" into dataset "staging"
    $ lyra-import -p myPrOj -d staging -t someSecretToken my-dataset.ndjson

    # Import into dataset "test" from stdin, read token from env var
    $ cat my-dataset.ndjson | lyra-import -p myPrOj -d test -

  Environment variables (fallbacks for missing flags)
    --token = LYRA_IMPORT_TOKEN
```

## License

MIT-licensed. See LICENSE.
