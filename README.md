# Three Kingdoms - Caocao Script Editor
ThreeKingdoms-Caocao : https://github.com/ysm1180/ThreeKingdoms-Caocao


## Prerequisites
- Python, at least version 2.7 (version 3 is not supported)
Note: Python 2.7 will be automatically installed for Windows users through installing windows-build-tools npm module (see below)

- A C/C++ compiler tool chain for your platform:
    - Windows
        -Set a PYTHON environment variable pointing to your python.exe. E.g.: C:\Python27\python.exe
        Install a compiler for the native modules VSCode is depending on

        Start Powershell as Administrator and install Windows Build Tools npm module (documentation).

        ```
        npm install --global windows-build-tools --vs2015
        ```

Install and build all of the dependencies using `Yarn`:
```
yarn
```

## Build and run
```
yarn dev
```

## Package build for win64
```
yarn build:win
```

## Reference
Visual Studio Code : https://github.com/Microsoft/vscode