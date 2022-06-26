# FisicAI - Backend

API for receive a physic problem, process it using Wit.ai and return the data requested, data catched and the resolution.

## Installation

You only need to install all packages and compile it

```bash
  npm install
  npm run build
```

Rename .env.example to .env and replace the values with your token of Wit

## Endpoints

- /api/solve-problem
    - Parameters
        - problem : string - Problem to resolve
        - resolution : object - Object for process data and requested data for resolve
            - requested : Array<string> - Data requested to be solved (Ex.: aceleracion, distancia, velocidad_final, etc)
            - data : Array<object> - Data with value and unit that will be used for find values of requested data
                - name : string - Name of data (aceleracion, velocidad, distancia, etc)
                - value : string - Value of the data (15, 20, etc)
                - unit : string - Unit of the data (m/s, km/h2, s, etc)
