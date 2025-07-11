Just a simple React/Typescript plugin for Chrome - Proof of concept

Example output:

<img src="./assets/images/chem-pal-demo.gif" alt="chem-pal example" width="600"/>

## Node version

- Make sure youre on node v22.15.0 and npm v10.9.2 or higher (use nvm if needed)

- Windows NVM: Installer is [here](https://github.com/coreybutler/nvm-windows/releases) (i've never tried it)
- OSX: Run `brew install nvm`, then follow the steps about updating your `~/.bash_profile` that it shows you in the output.

After nvm is installed, run:

```bash
nvm install --lts
nvm use --lts
node --version # Should output v22.15.0
```

Install pnpm (package manager)
```bash
npm install -g pnpm
```

## Building the extension

```bash
git clone https://github.com/jhyland87/chem-pal.git
cd chem-pal
pnpm run setup
pnpm run build
```

Then import the build folder as an unpacked chrome extension.

## Development

```bash
# Install dev dependencies
pnpm run setup

# Run unit tests
pnpm run test

# Run the build.
pnpm run build
```