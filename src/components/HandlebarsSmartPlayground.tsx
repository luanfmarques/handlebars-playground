import React, { useState, useCallback, useMemo } from "react";
import Handlebars from "handlebars";
import Editor from "@monaco-editor/react";
import { extractHandlebarsKeys } from "../utils/extractHandlebarsKeys";
import { generateDefaultData } from "../utils/generateDefaultData";

export const HandlebarsSmartPlayground = () => {
  const [template, setTemplate] = useState<string>("");
  const [dataJson, setDataJson] = useState<string>("{}");
  const [compiledHtml, setCompiledHtml] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    uploadTime: string;
  } | null>(null);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const html = event.target?.result as string;
        setTemplate(html);

        const keys = extractHandlebarsKeys(html);
        const initialData = generateDefaultData(keys);
        setDataJson(JSON.stringify(initialData, null, 2));

        const uploadTime = new Date().toLocaleString();
        setFileInfo({ name: file.name, uploadTime });
      };
      reader.readAsText(file);

      e.target.value = "";
    },
    []
  );

  const handleCompile = useCallback(() => {
    try {
      const data = JSON.parse(dataJson);
      const compiled = Handlebars.compile(template);
      const result = compiled(data);
      setCompiledHtml(result);
    } catch (error) {
      setCompiledHtml(
        `<pre style="color: red;">${(error as Error).message}</pre>`
      );
    }
  }, [template, dataJson]);

  const handleClear = useCallback(() => {
    setTemplate("");
    setDataJson("{}");
    setCompiledHtml("");
    setFileInfo(null);
  }, []);

  const handleTemplateChange = useCallback((value: string | undefined) => {
    setTemplate(value || "");
  }, []);

  const handleDataJsonChange = useCallback((value: string | undefined) => {
    setDataJson(value || "{}");
  }, []);

  const renderedResult = useMemo(() => {
    return (
      <div
        className="border rounded p-4 bg-white shadow-inner"
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
    );
  }, [compiledHtml]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold">Upload do HTML:</label>
        <input type="file" accept=".html" onChange={handleFileUpload} />
      </div>
      {fileInfo && (
        <div className="text-sm text-gray-600">
          Arquivo: {fileInfo.name} - {fileInfo.uploadTime}
        </div>
      )}

      <div>
        <label className="block font-semibold">Template HTML</label>
        <div
          className="border rounded overflow-hidden"
          style={{ height: "300px" }}
        >
          <Editor
            height="100%"
            defaultLanguage="html"
            value={template}
            onChange={handleTemplateChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold">Dados JSON</label>
        <div
          className="border rounded overflow-hidden"
          style={{ height: "200px" }}
        >
          <Editor
            height="100%"
            defaultLanguage="json"
            value={dataJson}
            onChange={handleDataJsonChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCompile}
        >
          Renderizar
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handleClear}
        >
          Limpar
        </button>
      </div>

      <div>
        <label className="block font-semibold">Resultado Renderizado</label>
        {renderedResult}
      </div>
    </div>
  );
};
