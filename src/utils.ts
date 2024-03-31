import { Image } from "@raycast/api";
import { ClassName } from "./types";

export const classIcon = (className: ClassName) => {
  return {
    source: `${className}.png`,
    mask: Image.Mask.Circle,
  };
};
