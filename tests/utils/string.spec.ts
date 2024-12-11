import {
  extractTitle,
  extractEmail,
  extractLastUrl,
} from "../../src/utils/string";

describe("Utility Functions", () => {
  describe("extractTitle", () => {
    it("should extract the title from HTML", () => {
      const html = `<html><head><title>Test Page</title></head><body></body></html>`;
      expect(extractTitle(html)).toBe("Test Page");
    });

    it("should return undefined if title tag is missing", () => {
      const html = `<html><head></head><body></body></html>`;
      expect(extractTitle(html)).toBeUndefined();
    });

    it("should return undefined if title tag is malformed", () => {
      const html = `<html><head><title>Missing closing tag</head><body></body></html>`;
      expect(extractTitle(html)).toBeUndefined();
    });
  });

  describe("extractEmail", () => {
    it("should extract the first email from HTML", () => {
      const html = `<div>Contact us at example@example.com for more info.</div>`;
      expect(extractEmail(html)).toBe("example@example.com");
    });

    it("should return undefined if no email is present", () => {
      const html = `<div>No email here!</div>`;
      expect(extractEmail(html)).toBeUndefined();
    });

    it("should return the first email if multiple are present", () => {
      const html = `<div>Emails: first@example.com, second@example.com</div>`;
      expect(extractEmail(html)).toBe("first@example.com");
    });

    it("should not match invalid email formats", () => {
      const html = `<div>Invalid emails: user@.com, @example.com, user@example, user@exam_ple.com</div>`;
      expect(extractEmail(html)).toBeUndefined();
    });
  });

  describe("findLastUrlInText", () => {
    it("should return the last URL in the text", () => {
      const text = `bla www.first.com asdfasdf www.second.com truc`;
      expect(extractLastUrl(text)).toBe("www.second.com");
    });

    it("should return null if no URLs are present", () => {
      const text = `There are no links here`;
      expect(extractLastUrl(text)).toBeNull();
    });

    it("should handle single URL", () => {
      const text = `some text www.google.com`;
      expect(extractLastUrl(text)).toBe("www.google.com");
    });
  });
});
