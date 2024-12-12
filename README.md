### Setup

1. Run `npm i`
2. Run `npm build`
3. Run `export IM_SECRET=custom_secret` to change `IM_SECRET`

### Run

#### 1. Using a file as Input

Usage `npm run start path/to/file.txt`
Example `npm run start example.txt`

#### 2. Using standard input

Run `npm run start` and enter text. Script will parse input line by line.
Or you can pipe input like `echo "[ www.google.com ]" | npm run start`.

#### 3. Unit tests

Run `npm test`
