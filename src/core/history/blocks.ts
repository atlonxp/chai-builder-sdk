import { useAtom } from "jotai";
import { presentBlocksAtom } from "../atoms/blocks.ts";
import { ChaiBlock } from "../types/ChaiBlock.ts";
import { useUndoManager } from "./useUndoManager.ts";
import { useBlocksStoreManager } from "./useBlocksStoreManager.ts";
import { first, map } from "lodash-es";
import { each, keys } from "lodash";

export const useBlocksStore = () => {
  return useAtom(presentBlocksAtom);
};

export const useBlocksStoreActions = () => {
  const { add } = useUndoManager();
  const [currentBlocks] = useBlocksStore();
  const { addBlocks: addNewBlocks, removeBlocks: removeExistingBlocks, updateBlocksProps } = useBlocksStoreManager();

  const addBlocks = (newBlocks: ChaiBlock[], parent?: string, position?: number) => {
    addNewBlocks(newBlocks, parent, position);
    add({
      undo: () => removeExistingBlocks(newBlocks),
      redo: () => addNewBlocks(newBlocks, parent, position),
    });
  };

  const removeBlocks = (blocks: ChaiBlock[]) => {
    const parentId = first(blocks)?._parent;
    const siblings = currentBlocks.filter((block) => block._parent === parentId);
    const position = siblings.indexOf(first(blocks));
    removeExistingBlocks(map(blocks, "_id"));
    add({
      undo: () => addNewBlocks(blocks, parentId, position),
      redo: () => removeExistingBlocks(map(blocks, "_id")),
    });
  };

  const updateBlocks = (blockIds: string[], props: Record<string, any>) => {
    const propKeys = keys(props);
    const currentPropValues = map(blockIds, (_id: string) => {
      const block = currentBlocks.find((block) => block._id === _id);
      const prevProps = { _id };
      each(propKeys, (key) => (prevProps[key] = block[key]));
      return prevProps;
    });

    updateBlocksProps(map(blockIds, (_id: string) => ({ _id, ...props })));
    add({
      undo: () => updateBlocksProps(currentPropValues),
      redo: () => updateBlocksProps(map(blockIds, (_id: string) => ({ _id, ...props }))),
    });
  };

  const updateBlocksRuntime = (blockIds: string[], props: Record<string, any>) => {
    updateBlocksProps(map(blockIds, (_id: string) => ({ _id, ...props })));
  };

  return {
    addBlocks,
    removeBlocks,
    updateBlocks,
    updateBlocksRuntime,
  };
};
