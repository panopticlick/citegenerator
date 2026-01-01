# API (OpenAPI + SDK)

## OpenAPI

- JSON spec: `GET /api/openapi.json`
- Default prod base URL: `https://api.citegenerator.org`

## TypeScript SDK

- Source: `docs/sdk/typescript/index.ts`
- Usage:

```ts
import { createCiteGeneratorClient } from "./docs/sdk/typescript";

const api = createCiteGeneratorClient({
  baseUrl: "https://api.citegenerator.org",
});

const { data } = await api.cite({ url: "https://example.com", style: "apa" });
console.log(data.citations.apa.text);
```
