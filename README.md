# GQL

GQL is an optimized format for writing GraphQL queries using white-space indentation. This format simplifies the structure, enhances readability, and significantly reduces the amount of typing required, making it less stressful to write and maintain complex queries.

## Features

- **Readability**: Use indentation to clearly represent nested structures.
- **Efficiency**: Fewer characters and less syntax noise than standard GraphQL.
- **Consistency**: A clean, predictable structure that's easy to follow.
- **Automatic edge-node expansion**: Assumes the default pattern `edges { node { ... } }` unless explicitly overridden.
- **Seamless integration**: GQL files are automatically converted to standard GraphQL as part of the build process.

## Quick Example

**GQL Format:**

```
query
  products(first: 10)
    title
    variants(first: 2)
      price
```

**Standard GraphQL Equivalent:**

```graphql
query {
  products(first: 10) {
    edges {
      node {
        title
        variants(first: 2) {
          edges {
            node {
              price
            }
          }
        }
      }
    }
  }
}
```

## Installation

Clone the repository:

```bash
git clone https://github.com/kellyjanderson/gql.git
```

## Usage

Write your queries in `.gql` files using the GQL format. During the build process, these files are automatically converted to standard `.graphql` files and then imported into your code.

_Example `query.gql` file:_

```
query
  products(first: 5)
    title
    description
```

_Example usage in code:_

```js
import query from './query.gql';
import { gql, request } from 'graphql-request';

const result = await request('https://your-api/graphql', gql`${query}`);
```

## Build Integration

The build process includes a conversion step that reads all `.gql` files and converts them into standard `.graphql` files. This happens automatically before your build.

Add the following to your `package.json` scripts:

```json
"scripts": {
  "convert:gql": "node convertGql.js",
  "prebuild": "npm run convert:gql",
  "build": "react-scripts build"
}
```

And create a file named `convertGql.js` with the following content:

```js
const path = require('path');
const convert = require('./gqlConverter');
convert(path.join(__dirname, 'src'));
```

## Syntax Rules

- Indentation defines structure (like Python).
- Arrays are enclosed in brackets; individual objects within arrays are separated by commas.
- Object fields are placed on separate lines with proper indentation.
- By default, nested fields in connections automatically expand into `edges { node { ... } }`.
- To override the default behavior, specify the desired structure explicitly.

### Example Mutation with Arrays

**GQL Format:**

```
mutation
  createProduct(input:
    title: "Shirt"
    description: "Cool cotton shirt."
    variants: [
      title: "Small"
      price: "20.00"
      sku: "S001",

      title: "Large"
      price: "22.00"
      sku: "L001"
    ]
  )
    product
      id
      title
```

## Directives

Directives are written as in standard GraphQL:

```
query getProducts($includeDesc: Boolean!)
  products(first: 10)
    title
    description @include(if: $includeDesc)
```

## Fragments

Fragments follow standard GraphQL syntax:

```
query
  products(first: 5)
    ...productFields

fragment productFields on Product
  title
  description
```

## Goals

- **Developer Experience**: GQL reduces syntax noise and friction.
- **Transparent Compilation**: GQL files are automatically converted to standard GraphQL.
- **Compatibility**: Outputs valid GraphQL for all servers and tools.

## License

This project is licensed under the MIT License.~~~~