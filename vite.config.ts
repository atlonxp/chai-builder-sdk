import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        core: resolve(__dirname, "src/core/main/index.ts"),
        render: resolve(__dirname, "src/render/index.ts"),
        ui: resolve(__dirname, "src/ui/index.ts"),
        lib: resolve(__dirname, "src/core/lib.ts"),
        server: resolve(__dirname, "src/server/index.ts"),
        studio: resolve(__dirname, "src/studio/index.tsx"),
        tailwind: resolve(__dirname, "src/tailwind/index.ts"),
        "web-blocks": resolve(__dirname, "src/blocks/web/index.ts"),
        "email-blocks": resolve(__dirname, "src/blocks/email/index.ts"),
        email: resolve(__dirname, "src/email/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      treeshake: false,
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "@bobthered/tailwindcss-palette-generator",
        "@chaibuilder/runtime",
        "@floating-ui/dom",
        "@floating-ui/react-dom",
        "@mhsdesign/jit-browser-tailwindcss",
        "@minoru/react-dnd-treeview",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-icons",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-toggle",
        "@radix-ui/react-tooltip",
        "@react-hookz/web",
        "@react-email/render",
        "@react-email/components",
        "@rjsf/core",
        "@rjsf/utils",
        "@rjsf/validator-ajv8",
        "@tailwindcss/aspect-ratio",
        "@tailwindcss/forms",
        "@tailwindcss/line-clamp",
        "@tailwindcss/typography",
        "class-variance-authority",
        "clsx",
        "cmdk",
        "date-fns",
        "flagged",
        "flat-to-nested",
        "focus-trap-react",
        "forgiving-xml-parser",
        "framer-motion",
        "fuse.js",
        "gray-matter",
        "himalaya",
        "html-formatter",
        "i18next",
        "jotai",
        "lodash",
        "lodash-es",
        "lucide-react",
        "nanoid",
        "post-robot",
        "react",
        "react-autosuggest",
        "react-colorful",
        "react-dnd",
        "react-dnd-html5-backend",
        "react-dom",
        "react-frame-component",
        "react-hotkeys-hook",
        "react-i18next",
        "react-icons",
        "react-icons-picker",
        "react-json-view",
        "react-quill",
        "react-textarea-autosize",
        "react-wrap-balancer",
        "@react-email/components",
        "@react-email/render",
        "react-email",
        "redux-undo",
        "sonner",
        "tailwind-merge",
        "tailwindcss-animate",
        "tippy.js",
        "unist-util-visit",
        "unsplash-js",
      ],
    },
  },
});
