# GQL Specification

## Overview

**GQL** (Graph Query Language) is an indentation-based syntax for writing GraphQL queries. It reduces the syntactic noise of braces, parentheses, and colons by replacing them with meaningful whitespace, similar to Python. The format is designed to be developer-friendly, easier to read, and quicker to write.

It is intended as a **preprocessing format**: GQL files are converted to standard GraphQL before being sent to a server.

---

## Syntax Rules

### 1. **Whitespace and Indentation**

- Indentation (2 or 4 spaces) defines scope and hierarchy.
- Braces `{}` are replaced with increasing/decreasing indentation.
- No need for commas or colons between fields.

### 2. **Default `edges { node { ... } }` Expansion**

- When a connection field (e.g. `products`, `variants`) is listed, GQL assumes:
  
  ```graphql
  products {
    edges {
      node {
        ...
      }
    }
  }
  ```

- You may override this by explicitly specifying paths:

```gql
products
  edges
    cursor
    node
      title
```

### 3. **Arguments**

- Arguments use parentheses, just like GraphQL:

```gql
products(first: 10, reverse: true)
```

### 4. **Arrays**

- Arrays are enclosed in square brackets `[ ... ]`
- Objects inside arrays are separated by commas
- Each object’s properties are indented on new lines

Example:

```gql
variants: [
  title: "Small"
  price: "10.00"
  sku: "SKU1",

  title: "Large"
  price: "20.00"
  sku: "SKU2"
]
```

### 5. **Directives**

- GQL supports GraphQL directives using standard syntax:

```gql
description @include(if: $includeDesc)
```

### 6. **Fragments**

- You can use fragments the same way as in GraphQL:

```gql
query
  products(first: 5)
    ...productFields

fragment productFields on Product
  title
  description
```

### 7. **Mutations**

- Mutations follow the same syntax as queries:

```gql
mutation
  createProduct(input:
    title: "New Product"
    description: "An example."
    variants: [
      title: "A"
      price: "5.00"
      sku: "A001"
    ]
  )
    product
      id
      title
```

---

## Comparison Example

### GQL:

```gql
query
  products(first: 10)
    title
    description
    variants(first: 2)
      price
```

### Compiled GraphQL:

```graphql
query {
  products(first: 10) {
    edges {
      node {
        title
        description
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

---

## Overriding Defaults

To manually specify a different structure (e.g., skip the `node` part), explicitly write the field structure:

```gql
products
  edges
    cursor
    node
      title
```

---

## Goals

- **Reduce friction** of writing complex nested queries.
- **Improve readability** and visual structure.
- **Encourage consistency** in how GraphQL is written.
- **Enable transpilation** to standard GraphQL at build time.
- **Minimize bugs** due to unmatched or misnested braces.

---

## Status

GQL is a **preprocessor syntax**, not a GraphQL server or client replacement. It is intended for use in dev tools and build systems, with transparent conversion into `.graphql` queries before execution.
