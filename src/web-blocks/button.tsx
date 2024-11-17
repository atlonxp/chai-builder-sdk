import * as React from "react";
import { ButtonIcon } from "@radix-ui/react-icons";
import { ChaiBlockComponentProps, registerChaiBlockSchema, StylesProp } from "@chaibuilder/runtime";

type ButtonProps = ChaiBlockComponentProps<{
  content: string;
  icon: string;
  iconSize: number;
  iconPos: "order-first" | "order-last";
}>;

const Component = (props: ButtonProps) => {
  const { blockProps, iconSize, icon, content, iconPos, styles, children } = props;
  const _icon = icon;

  const child = children || (
    <>
      <span data-ai-key="content">{content}</span>
      {_icon && (
        <div
          style={{ width: iconSize + "px" }}
          className={iconPos + " " + (iconPos === "order-first" ? "mr-2" : "ml-2") || ""}
          dangerouslySetInnerHTML={{ __html: _icon }}
        />
      )}
    </>
  );
  return React.createElement(
    "button",
    {
      ...blockProps,
      ...styles,
      type: "button",
    },
    child,
  );
};

const Config = {
  type: "Button",
  label: "Button",
  category: "core",
  icon: ButtonIcon,
  group: "basic",
  ...registerChaiBlockSchema({
    default: {
      content: "Button",
      icon: "",
      iconSize: 24,
      iconPos: "order-last",
      styles: "#styles:,text-primary-foreground bg-primary px-4 py-2 rounded-lg flex items-center",
    },
    properties: {
      styles: StylesProp("text-primary-foreground bg-primary px-4 py-2 rounded-lg flex items-center"),
      content: {
        type: "string",
        title: "Button label",
      },
      icon: {
        type: "string",
        title: "Icon",
        ui: { "ui:widget": "icon" },
      },
      iconSize: {
        type: "number",
        title: "Icon size",
      },
      iconPos: {
        type: "string",
        title: "Icon position",
        enum: ["order-first", "order-last"],
      },
    },
  }),
  i18nProps: ["content"],
  aiProps: ["content"],
};
export { Component, Config };
