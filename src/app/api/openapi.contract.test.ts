import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutService, type CheckoutRepository } from "@/lib/checkout/checkout-service";
import { CashOnDeliveryGateway } from "@/lib/checkout/payment";

type Schema = { type?: string | string[]; required?: string[]; properties?: Record<string, Schema>; $ref?: string; enum?: string[]; items?: Schema };
const spec = JSON.parse(readFileSync(join(process.cwd(), "public/openapi.json"), "utf8"));
const API_DIR = join(process.cwd(), "src/app/api");

function resolve(schema: Schema): Schema {
  return schema.$ref ? resolve(spec.components.schemas[schema.$ref.split("/").pop()!]) : schema;
}

/** Small structural check: required keys exist and primitive types match. Enough to catch drift. */
function conforms(value: unknown, schema: Schema, path = "body"): string[] {
  const s = resolve(schema);
  const types = [s.type ?? "object"].flat();
  if (value === null) return types.includes("null") ? [] : [`${path} is null`];
  if (s.enum && !s.enum.includes(value as string)) return [`${path} is not one of ${s.enum.join(", ")}`];
  if (types.includes("integer")) return Number.isInteger(value) ? [] : [`${path} is not an integer`];
  if (types.includes("string")) return typeof value === "string" ? [] : [`${path} is not a string`];
  if (types.includes("array")) return Array.isArray(value) ? value.flatMap((item, i) => conforms(item, s.items!, `${path}[${i}]`)) : [`${path} is not an array`];
  if (typeof value !== "object") return [`${path} is not an object`];
  const record = value as Record<string, unknown>;
  return [
    ...(s.required ?? []).filter((key) => !(key in record)).map((key) => `${path}.${key} is missing`),
    ...Object.entries(record).flatMap(([key, item]) => (s.properties?.[key] ? conforms(item, s.properties[key], `${path}.${key}`) : [`${path}.${key} is not documented`])),
  ];
}

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? routeFiles(join(dir, entry.name)) : entry.name === "route.ts" ? [join(dir, entry.name)] : []
  );
}

describe("OpenAPI contract", () => {
  it("documents exactly the route handlers that exist", () => {
    const implemented = routeFiles(API_DIR).flatMap((file) => {
      const path = "/api/" + relative(API_DIR, file).replace(/\/?route\.ts$/, "").replace(/\[(\w+)\]/g, "{$1}");
      const methods = [...readFileSync(file, "utf8").matchAll(/export (?:async )?function (GET|POST|PUT|PATCH|DELETE)\b/g)].map((m) => m[1].toLowerCase());
      return methods.map((method) => `${method} ${path.replace(/\/$/, "")}`);
    });
    const documented = Object.entries(spec.paths as Record<string, object>).flatMap(([path, operations]) => Object.keys(operations).map((method) => `${method} ${path}`));
    expect(implemented.sort()).toEqual(documented.sort());
  });

  describe("POST /api/orders", () => {
    const repository: CheckoutRepository = {
      findProducts: vi.fn().mockResolvedValue([{ id: "notebook", name: "Everyday notebook", price: 12000, stock: 20 }]),
      createPendingOrder: vi.fn().mockResolvedValue({ id: "order-1" }),
      confirmOrder: vi.fn().mockResolvedValue(undefined),
      cancelOrder: vi.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
      // Real CheckoutService and route handler; only the database repository is mocked.
      vi.doMock("@/lib/checkout", () => ({ createCheckoutService: () => new CheckoutService(repository, [new CashOnDeliveryGateway()]) }));
    });

    async function post(body: unknown) {
      const { POST } = await import("./orders/route");
      return POST(new Request("http://test/api/orders", { method: "POST", body: JSON.stringify(body) }));
    }

    const example = spec.paths["/api/orders"].post.requestBody.content["application/json"].example;

    it("the documented request example is accepted and the 201 body matches OrderConfirmation", async () => {
      const response = await post(example);
      expect(response.status).toBe(201);
      expect(conforms(await response.json(), spec.paths["/api/orders"].post.responses["201"].content["application/json"].schema)).toEqual([]);
    });

    it("errors use the documented status codes and Error schema", async () => {
      const response = await post({ ...example, promoCode: "NOPE" });
      expect(Object.keys(spec.paths["/api/orders"].post.responses)).toContain(String(response.status));
      expect(conforms(await response.json(), { $ref: "#/components/schemas/Error" })).toEqual([]);
    });
  });
});
