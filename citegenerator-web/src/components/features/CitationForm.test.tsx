import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CitationForm } from "./CitationForm";

describe("<CitationForm />", () => {
  it("validates empty url", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    render(<CitationForm onSubmit={onSubmit} isLoading={false} />);
    await user.click(screen.getByRole("button", { name: /generate citation/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a URL");
  });

  it("validates invalid url", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    render(<CitationForm onSubmit={onSubmit} isLoading={false} />);
    const input = screen.getAllByRole("textbox")[0];
    await user.type(input, "notaurl");
    await user.click(screen.getByRole("button", { name: /generate citation/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a valid URL");
  });
});
