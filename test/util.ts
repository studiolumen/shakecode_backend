export function expect(result: string) {
  return {
    toBe: (expected) => {
      if (result.trim() !== expected.trim())
        throw new Error(
          `Unexpected output\nExpected: ${expected}\nOutput  : ${result}`,
        );
      else console.log("Test successful.\nOutput: " + result.trim());
    },
  };
}
