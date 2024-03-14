import { describe, it, expect } from "vitest";
import { Home } from "./Home";
import { fireEvent, render, screen, waitFor } from "../test-utils";

describe("<Home />", () => {
  it("should upload a file successfully", async () => {
    render(<Home />);
    // Assuming you have a file input for tests
    const file = new File(["dummy content"], "passport.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText(
      /upload passport photo/i
    ) as HTMLInputElement;
    const uploadButton = screen.getByRole("button", { name: /upload/i });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);

    // Wait for an element to disappear, indicating the uploading process is finished.
    await waitFor(() => {
      // Check if the "uploading..." text is no longer in the document.
      // Since Vitest doesn't support `.toBeInTheDocument()`, we'll use a truthy check on the query result.
      const uploadingText = screen.queryByText(/uploading.../i);
      expect(uploadingText).toBeNull(); // This is how you can assert something is not in the document
    });

    // Since you reset the form after a successful upload, you can check if the input is cleared
    expect(fileInput?.value).toBe("");

    // Check if the error message is not present in the document.
    // Similar to the previous assertion, we use a check to see if the result is null.
    const errorText = screen.queryByText(/error/i);
    expect(errorText).toBeNull(); // This indicates the error message is not part of the document.
  });
});
