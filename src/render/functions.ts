import { flattenDeep, last } from "lodash-es";
import { STYLES_KEY } from "../core/constants/STRINGS.ts";
import { ChaiBlock } from "../core/types/ChaiBlock.ts";

/**
 * This function adds the prefix to the classes
 * @param classes
 * @param prefix
 */
export const addPrefixToClasses = (classes: string, prefix: string = "") => {
  const classesArray = classes.replace(STYLES_KEY, "").split(",");
  const array = classesArray.map((item) => {
    const classes = item.split(" ");
    const newClasses = classes.map((item) => {
      if (item === "") return "";
      // if the class had a state of media query, then prefix the classes
      // eg: dark:hover:bg-red-500 => dark:hover:c-bg-red-500
      // eg: hover:bg-red-500 => hover:c-bg-red-500
      if (item.includes(":")) {
        const values = item.split(":");
        // replace the last value from values with prefixedClass
        values[values.length - 1] = prefix + last(values);
        return values.join(":");
      }
      return `${prefix}${item}`;
    });
    return newClasses.join(" ");
  });
  return flattenDeep(array).join(" ");
};

/**
 * This function converts the chai format content to chai blocks
 * @param chaiFormatContent
 */
export const convertToBlocks = (chaiFormatContent: string): ChaiBlock[] => {
  if (!chaiFormatContent) return [];
  try {
    const blocks = JSON.parse(removeAssetPrefix(chaiFormatContent));
    //remove the blocks whose _type starts with @chai
    return blocks.filter((block) => !block._type.startsWith("@chai"));
  } catch (error) {
    return [{ _type: "Paragraph", _id: "error", content: "Invalid JSON. Please check the JSON string." }];
  }
};

/**
 * This function removes the "asset://" prefix from asset URLs in the input string.
 * This is important for chai files generated by Chai Studio.
 * This is how urls are generated in Tauri apps Before rendering to HTML need to convert them into
 * relative paths
 * @param input
 */
function removeAssetPrefix(input: string): string {
  // Step 1: Find the asset URL
  const regex = /(asset:\/\/|https:\/\/asset\.localhost\/)(?:localhost\/)?[^"']+/g;

  return input.replace(regex, (match) => {
    // Step 2: Decode the entire URL
    const decodedUrl = decodeURIComponent(match);

    // Step 3: Remove the part up to and including "public"
    const publicIndex = decodedUrl.indexOf("public");
    if (publicIndex !== -1) {
      return decodedUrl.substring(publicIndex + 6); // +6 to remove "public"
    }

    // If "public" is not found, return the entire decoded URL
    return decodedUrl;
  });
}
