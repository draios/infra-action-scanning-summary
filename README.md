# infra-action-scanning-summary
Github action to create a job summary report

## Usage

Sample usage

```yaml
    - name: Job Summary
      uses: draios/infra-action-scanning-summary@v0.0.1
      with:
        report-file-path: ${{ inputs.scanning-report-path }}
```

## Build

Install the dependencies

```bash
npm install
```

## Package

Packaging assembles the code into one file, preventing the need to check in `node_modules`.

You must have `ncc` installed (`npm i -g @vercel/ncc`). Then run: 

```bash
npm run prepare
```

It will create the `dist` folder.