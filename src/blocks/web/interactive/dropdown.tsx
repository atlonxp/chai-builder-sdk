import { registerChaiBlock } from "@chaibuilder/runtime";
import { Styles } from "@chaibuilder/runtime/controls";
import { addForcedClasses } from "../helper.ts";
import { STYLES_KEY } from "../../../core/constants/STRINGS.ts";
import { generateUUID } from "../../../core/functions/Functions.ts";

const Dropdown = ({ children, blockProps, styles }) => {
  const forcedStyles = addForcedClasses(styles, "hs-dropdown");
  return (
    <div {...blockProps} {...forcedStyles}>
      {children}
    </div>
  );
};

registerChaiBlock(Dropdown, {
  type: "Dropdown",
  label: "Dropdown",
  category: "core",
  group: "advanced",
  props: {
    styles: Styles({ default: "relative inline-flex" }),
  },
  // @ts-ignore
  blocks: () => {
    const id = `dropdown-` + generateUUID();
    const num = "1";
    return [
      { _id: "a" + num, _type: "Dropdown", _name: "Dropdown" },
      {
        _id: "b" + num,
        _type: "DropdownToggle",
        _parent: "a" + num,
        _name: "Dropdown Toggle",
        styles: `${STYLES_KEY},py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800`,
        styles_attrs: { "aria-controls": id },
      },
      { _id: "b3" + num, _type: "Text", _parent: "b" + num, content: "Action" },
      {
        _id: "b4" + num,
        _type: "Icon",
        _parent: "b" + num,
        icon: `<svg class="hs-dropdown-open:rotate-180 size-4 text-gray-600 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>`,
      },
      {
        _id: "c" + num,
        _type: "DropdownMenu",
        _parent: "a" + num,
        _name: "Dropdown Menu",
        styles: `${STYLES_KEY},transition-opacity transition-margin duration hs-dropdown-open:opacity-100 opacity-0 w-56 hidden z-10 mt-2 min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700`,
        styles_attrs: { "aria-labelledby": id, id: "dddd" },
      },
      {
        _id: "c1" + num,
        _type: "Text",
        _parent: "c" + num,
        content:
          "It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
      },
    ];
  },
});

const DropdownToggle = ({ children, blockProps, styles }) => {
  const forcedStyles = addForcedClasses(styles, "hs-dropdown-toggle");
  return (
    <button type={"button"} {...forcedStyles} {...blockProps}>
      {children}
    </button>
  );
};

registerChaiBlock(DropdownToggle, {
  type: "DropdownToggle",
  label: "Dropdown Toggle",
  category: "core",
  group: "advanced",
  hidden: true,
  props: { styles: Styles({ default: "" }) },
  canAcceptBlock: () => true,
  canDelete: () => false,
  canMove: () => false,
  canDuplicate: () => false,
});

const DropdownMenu = ({ children, blockProps, styles }) => {
  const forcedStyles = addForcedClasses(styles, "hs-dropdown-menu");
  return (
    <div {...forcedStyles} {...blockProps}>
      {children}
    </div>
  );
};

registerChaiBlock(DropdownMenu, {
  type: "DropdownMenu",
  label: "Dropdown Menu",
  category: "core",
  group: "advanced",
  hidden: true,
  props: {
    styles: Styles({
      default:
        "transition-opacity transition-margin duration hs-dropdown-open:opacity-100 opacity-0 w-56 hidden z-10 mt-2 min-w-60 bg-white",
    }),
  },
  canAcceptBlock: () => true,
  canDelete: () => false,
  canMove: () => false,
  canDuplicate: () => false,
});
