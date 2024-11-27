import { IChangeEvent } from "@rjsf/core";
import { includes, set, capitalize, cloneDeep, debounce, get, isEmpty, keys, map, forEach, startCase } from "lodash-es";
import { useLanguages, useSelectedBlock, useUpdateBlocksProps, useUpdateBlocksPropsRealtime } from "../../hooks";
import DataBindingSetting from "../../rjsf-widgets/data-binding.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui";
import { useCallback, useMemo, useState } from "react";
import { JSONForm } from "./JSONForm.tsx";
import { CanvasSettings } from "./CanvasSettings.tsx";
import { GlobalBlockSettings } from "./GlobalBlockSettings.tsx";
import { getBlockFormSchemas, getRegisteredChaiBlock } from "@chaibuilder/runtime";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useWrapperBlock } from "../../hooks";

const formDataWithSelectedLang = (formData, selectedLang: string, coreBlock) => {
  const updatedFormData = cloneDeep(formData);
  forEach(keys(formData), (key) => {
    if (includes(get(coreBlock, "i18nProps", []), key) && !isEmpty(selectedLang)) {
      updatedFormData[key] = get(formData, `${key}-${selectedLang}`);
    }
  });

  return updatedFormData;
};

const convertDotNotationToObject = (key: string, value: any) => {
  const result = {};
  set(result, key, value);
  return result;
};

/**
 *
 * @returns Block Setting
 */
export default function BlockSettings() {
  const { selectedLang } = useLanguages();
  const selectedBlock = useSelectedBlock() as any;
  const updateBlockPropsRealtime = useUpdateBlocksPropsRealtime();
  const updateBlockProps = useUpdateBlocksProps();
  const registeredBlock = getRegisteredChaiBlock(selectedBlock?._type);
  const formData = formDataWithSelectedLang(selectedBlock, selectedLang, registeredBlock);
  const [prevFormData, setPrevFormData] = useState(formData);
  const dataBindingSupported = false;

  const [showWrapperSetting, setShowWrapperSetting] = useState(false);
  const wrapperBlock = useWrapperBlock();
  const registeredWrapperBlock = getRegisteredChaiBlock(wrapperBlock?._type);
  const wrapperFormData = formDataWithSelectedLang(wrapperBlock, selectedLang, registeredWrapperBlock);

  const updateProps = ({ formData: newData }: IChangeEvent, id?: string, oldState?: any) => {
    if (id && prevFormData?._id === selectedBlock._id) {
      const path = id.replace("root.", "") as string;
      updateBlockProps([selectedBlock._id], { [path]: get(newData, path) } as any, oldState);
    }
  };

  const debouncedCall = useCallback(
    debounce(({ formData }, id, oldPropState) => {
      updateProps({ formData } as IChangeEvent, id, oldPropState);
      setPrevFormData(formData);
    }, 1500),
    [selectedBlock?._id, selectedLang],
  );

  const updateRealtime = ({ formData: newData }: IChangeEvent, id?: string) => {
    if (id) {
      const path = id.replace("root.", "") as string;
      updateBlockPropsRealtime(
        [selectedBlock._id],
        convertDotNotationToObject(path, get(newData, path.split("."))) as any,
      );
      debouncedCall({ formData: newData }, id, { [path]: get(prevFormData, path) });
    }
  };

  const updateWrapperRealtime = ({ formData: newData }: IChangeEvent, id?: string) => {
    if (id) {
      const path = id.replace("root.", "") as string;
      updateBlockPropsRealtime(
        [wrapperBlock._id],
        convertDotNotationToObject(path, get(newData, path.split("."))) as any,
      );
      debouncedCall({ formData: newData }, id, { [path]: get(prevFormData, path) });
    }
  };

  const bindingProps = keys(get(formData, "_bindings", {}));

  const { schema, uiSchema } = useMemo(() => {
    const type = selectedBlock?._type;
    if (!type) {
      return;
    }
    return getBlockFormSchemas(type);
  }, [selectedBlock]);

  const { wrapperSchema, wrapperUiSchema } = useMemo(() => {
    if (!wrapperBlock || !wrapperBlock?._type) {
      return { wrapperSchema: {}, wrapperUiSchema: {} };
    }
    const type = wrapperBlock?._type;
    const { schema: wrapperSchema = {}, uiSchema: wrapperUiSchema = {} } = getBlockFormSchemas(type);
    return { wrapperSchema, wrapperUiSchema };
  }, [wrapperBlock]);

  return (
    <div className="no-scrollbar overflow-x-hidden px-px">
      {!isEmpty(wrapperBlock) && (
        <div className="mb-4 rounded border bg-zinc-100 px-1">
          <div
            onClick={() => setShowWrapperSetting((prev) => !prev)}
            className="flex cursor-pointer items-center gap-x-1 py-2 text-xs font-medium leading-tight hover:bg-slate-100">
            {showWrapperSetting ? (
              <ChevronDown className="h-4 w-4 stroke-[3] text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 stroke-[3] text-slate-400" />
            )}
            {startCase(wrapperBlock._type)} settings{" "}
            {wrapperBlock._name && (
              <span className="text-[11px] font-light text-slate-400">({wrapperBlock._name})</span>
            )}
          </div>
          {showWrapperSetting && (
            <JSONForm
              id={wrapperBlock?._id}
              onChange={updateWrapperRealtime}
              formData={wrapperFormData}
              schema={wrapperSchema}
              uiSchema={wrapperUiSchema}
            />
          )}
        </div>
      )}
      {dataBindingSupported ? (
        <Accordion type="multiple" defaultValue={["STATIC", "BINDING"]} className="mt-4 h-full w-full">
          <AccordionItem value="BINDING">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-x-2">
                <div
                  className={`h-[8px] w-[8px] rounded-full ${
                    !isEmpty(get(selectedBlock, "_bindings", {})) ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                Data Binding
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <DataBindingSetting
                bindingData={get(selectedBlock, "_bindings", {})}
                onChange={(_bindings) => {
                  updateProps({ formData: { _bindings } } as IChangeEvent, "root._bindings");
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="STATIC">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-x-2">
                <div className={`h-[8px] w-[8px] rounded-full bg-blue-500`} />
                Static Content
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              {!isEmpty(bindingProps) ? (
                <div className="mb-1 mt-0 rounded-sm border border-orange-500 bg-orange-100 p-1 text-xs text-orange-500">
                  Data binding is set for <b>{map(bindingProps, capitalize).join(", ")}</b>{" "}
                  {bindingProps.length === 1 ? "property" : "properties"}. Remove data binding to edit static content.
                </div>
              ) : null}
              <JSONForm
                id={selectedBlock?._id}
                onChange={updateRealtime}
                formData={formData}
                schema={schema}
                uiSchema={uiSchema}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : !isEmpty(schema) ? (
        <JSONForm
          id={selectedBlock?._id}
          onChange={updateRealtime}
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
        />
      ) : null}
      {selectedBlock?._type === "GlobalBlock" ? <GlobalBlockSettings /> : null}
      <CanvasSettings />
    </div>
  );
}
