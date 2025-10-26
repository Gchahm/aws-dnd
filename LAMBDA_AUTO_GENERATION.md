# Automatic Lambda Function Generation from tRPC Routes

## Overview

The application automatically generates an AWS Lambda function for each tRPC route defined in the API. This is achieved through a combination of TypeScript type inference, CDK constructs, and code generation utilities.

## How It Works

### 1. Define tRPC Routes
**File:** `packages/game-api/src/router.ts`

The tRPC router defines all API endpoints in a nested structure:

```typescript
export const appRouter = router({
  actions: router({
    query: queryActions,    // → actions.query
    save: saveAction,       // → actions.save
  }),
  games: router({
    query: queryGames,      // → games.query
    save: saveGame,         // → games.save
  }),
  inventory: router({
    query: queryInventory,  // → inventory.query
  }),
});
```

### 2. Extract Route Information
**File:** `packages/common/constructs/src/core/api/trpc-utils.ts`

The `routerToOperations()` function recursively traverses the tRPC router and extracts:
- Full procedure paths (e.g., `actions.query`, `games.save`)
- HTTP methods (queries → GET, mutations → POST)

```typescript
export const routerToOperations = <TRouter extends AnyTRPCRouter>(
  router: TRouter,
  prefix = '',
): Record<Procedures<TRouter>, OperationDetails> => {
  // Recursively extracts all procedures with their paths and methods
}
```

### 3. Create Lambda Functions via CDK Construct
**File:** `packages/common/constructs/src/app/apis/game-api.ts`

The `GameApi.defaultIntegrations()` method uses the `IntegrationBuilder` to automatically create a Lambda function for each extracted route:

```typescript
public static defaultIntegrations = (scope: Construct) => {
  return IntegrationBuilder.rest({
    operations: routerToOperations(appRouter),  // Extract all routes
    defaultIntegrationOptions: {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromAsset('dist/packages/game-api/bundle'),
      // ... other Lambda config
    },
    buildDefaultIntegration: (op, props: FunctionProps) => {
      // Create a unique Lambda function for each operation
      const handler = new Function(scope, `GameApi${op}Handler`, props);
      return { handler, integration: new LambdaIntegration(handler) };
    },
  });
};
```

### 4. Deploy in Infrastructure Stack
**File:** `packages/infra/src/stacks/application-stack.ts`

The application stack instantiates the API with auto-generated integrations:

```typescript
  integrations: GameApi.defaultIntegrations(this)
    .withDefaultOptions({
      environment: {
        TABLE_NAME: electroDbTable.tableName,
      },
    })
    .build(),
});
```

### 5. Grant Permissions to Lambda Functions

Individual Lambda functions are accessible via the `integrations` property:

```typescript
electroDbTable.grantReadData(gameApi.integrations['actions.query'].handler);
electroDbTable.grantReadData(gameApi.integrations['games.query'].handler);
electroDbTable.grantReadWriteData(gameApi.integrations['actions.save'].handler);
```

## Key Files in the Auto-Generation Pipeline

1. **`packages/game-api/src/router.ts`**
   - Defines the tRPC router with all API endpoints

2. **`packages/common/constructs/src/core/api/trpc-utils.ts`**
   - `routerToOperations()`: Extracts procedure names and HTTP methods from tRPC router
   - `Procedures<T>`: TypeScript type that creates a union of all procedure names

3. **`packages/common/constructs/src/core/api/utils.ts`**
   - `IntegrationBuilder`: Builder pattern for creating API integrations
   - `OperationDetails`: Interface defining path and HTTP method for each operation

4. **`packages/common/constructs/src/app/apis/game-api.ts`**
   - `GameApi`: CDK construct that creates API Gateway with Lambda integrations
   - `defaultIntegrations()`: Factory method that generates Lambda functions for all routes

5. **`packages/infra/src/stacks/application-stack.ts`**
   - Orchestrates the deployment and wires up permissions

## Result

For the example router above, the following Lambda functions are automatically created:

- `GameApiactions.queryHandler` (GET /actions.query)
- `GameApiactions.saveHandler` (POST /actions.save)
- `GameApigames.queryHandler` (GET /games.query)
- `GameApigames.saveHandler` (POST /games.save)
- `GameApiinventory.queryHandler` (GET /inventory.query)

All functions share the same bundled code but are independently scalable and monitorable in AWS.

## Benefits

✅ **Type-Safe**: TypeScript ensures all routes are properly mapped
✅ **Automatic**: No manual Lambda function definitions needed
✅ **Granular Permissions**: Each Lambda can have specific IAM permissions
✅ **Independent Scaling**: Each endpoint scales independently
✅ **Zero Configuration**: Add a new tRPC route → Lambda function automatically generated
