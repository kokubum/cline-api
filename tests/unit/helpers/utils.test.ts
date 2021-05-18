import { capitalizeName, isString } from "../../../src/helpers/utils";

describe("Utils", () => {
  describe("Is a String Function", () => {
    it("Should return true if the argument is a string type", () => {
      expect(isString("random_string")).toBeTruthy();
    });

    it("Should return false if the argument isn't a string type", () => {
      expect(isString({ randomField: "random" })).toBeFalsy();
    });
  });

  describe("Capitalize Name", () => {
    it("Should return a capitalized string", () => {
      expect(capitalizeName("random_name")).toBe("Random_name");
    });
  });
});
