import { describe, expect, test } from "bun:test";
import { buyReturnPath, safeBuyReturnPath } from "../src/lib/buyReturn";
import { checkoutUser } from "../supabase/functions/create-checkout/auth";

describe("buyer sign-in", () => {
  test("checkout rejects missing or invalid sign-in and anonymous accounts", async () => {
    const missing = await checkoutUser(null, async () => { throw new Error("must not run"); });
    expect(missing).toBeNull();
    expect(await checkoutUser("Bearer invalid", async () => ({ data: { user: null }, error: new Error("invalid") }))).toBeNull();
    expect(await checkoutUser("Bearer guest", async () => ({ data: { user: { id: "guest", is_anonymous: true } }, error: null }))).toBeNull();
    expect(await checkoutUser("Bearer valid", async () => ({ data: { user: { id: "buyer" } }, error: null }))).toEqual({ id: "buyer" });
  });
  test("login return preserves gift card and quantity with the other selections", () => {
    const path = buyReturnPath({ card: "amazon-card-id", quantity: 3, amount: 100, country: "US", format: "digital" });
    const params = new URL(path, "https://example.com").searchParams;
    expect(params.get("card")).toBe("amazon-card-id");
    expect(params.get("quantity")).toBe("3");
    expect(params.get("amount")).toBe("100");
    expect(params.get("country")).toBe("US");
    expect(params.get("format")).toBe("digital");
    expect(safeBuyReturnPath(path)).toBe(path);
  });
  test("login does not accept external return destinations", () => {
    for (const path of [null, "https://evil.example/buy", "//evil.example", "/buy?\\evil.example"]) {
      expect(safeBuyReturnPath(path)).toBe("/dashboard");
    }
  });
});