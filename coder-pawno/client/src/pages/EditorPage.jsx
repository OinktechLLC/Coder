import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAppStore } from '../store/appStore';

const EditorPage = () => {
  const { code, setCode, language, setLanguage, compileCode, isCompiling, compilationResult } = useAppStore();
  const [fileName, setFileName] = useState('main.pwn');
  const [files, setFiles] = useState([]);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  // Обработка изменения кода
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Компиляция кода
  const handleCompile = async () => {
    try {
      const result = await compileCode(code, language);
      if (result.success) {
        toast.success('Компиляция успешна!');
      } else {
        toast.error('Ошибка компиляции');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Перевод русского текста в код
  const handleTranslateToCode = async () => {
    if (!code.trim()) {
      toast.error('Введите текст для перевода');
      return;
    }

    setIsTranslating(true);
    try {
      const response = await axios.post('/api/translate-to-code', {
        text: code,
        language: language
      });

      if (response.data.success) {
        setCode(response.data.translatedCode);
        toast.success('Текст переведен в код!');
      }
    } catch (error) {
      toast.error('Ошибка перевода');
    } finally {
      setIsTranslating(false);
    }
  };

  // Загрузка проекта (ZIP)
  const handleLoadProject = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      const loadedFiles = [];
      const filePromises = [];

      contents.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          filePromises.push(
            zipEntry.async('string').then((content) => {
              loadedFiles.push({
                name: relativePath,
                content
              });
            })
          );
        }
      });

      await Promise.all(filePromises);
      setFiles(loadedFiles);
      
      if (loadedFiles.length > 0) {
        setFileName(loadedFiles[0].name);
        setCode(loadedFiles[0].content);
      }
      
      toast.success(`Загружено файлов: ${loadedFiles.length}`);
    } catch (error) {
      toast.error('Ошибка загрузки проекта');
    }
  };

  // Скачивание проекта
  const handleDownloadProject = async () => {
    try {
      const zip = new JSZip();
      
      // Добавляем текущий файл
      zip.file(fileName, code);
      
      // Добавляем другие файлы если есть
      files.forEach(file => {
        if (file.name !== fileName) {
          zip.file(file.name, file.content);
        }
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'project.zip');
      
      toast.success('Проект скачан!');
    } catch (error) {
      toast.error('Ошибка скачивания проекта');
    }
  };

  // Сохранение файла
  const handleSaveFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    saveAs(blob, fileName);
    toast.success('Файл сохранен!');
  };

  // Выбор языка
  const getMonacoLanguage = () => {
    switch (language) {
      case 'pawno':
      case 'pawn':
        return 'javascript'; // Monaco не имеет Pawn, используем JS как fallback
      case 'cpp':
        return 'cpp';
      case 'python':
        return 'python';
      case 'javascript':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-premium-950 via-premium-900 to-premium-800">
      {/* Toolbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark border-b border-premium-500/20 p-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text">Coder-Pawno Editor</h1>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-premium"
            >
              <option value="pawno">Pawno (Pawn)</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoadProject}
              accept=".zip"
              className="hidden"
            />
            <button onClick={() => fileInputRef.current?.click()} className="btn-premium text-sm">
              📁 Загрузить проект
            </button>

            <button onClick={handleDownloadProject} className="btn-premium text-sm">
              💾 Скачать проект
            </button>

            <button onClick={handleSaveFile} className="btn-premium text-sm">
              💿 Сохранить файл
            </button>

            <button
              onClick={handleTranslateToCode}
              disabled={isTranslating}
              className="btn-premium text-sm bg-green-600 hover:bg-green-700"
            >
              {isTranslating ? '⏳ Перевод...' : '🌐 Перевести с русского'}
            </button>

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="btn-premium text-sm bg-red-600 hover:bg-red-700"
            >
              {isCompiling ? '⏳ Компиляция...' : '▶️ Компилировать'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {showFileExplorer && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 glass-dark border-r border-premium-500/20 p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Файлы</h3>
              <button
                onClick={() => setShowFileExplorer(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {files.length === 0 ? (
                <p className="text-gray-400 text-sm">Нет загруженных файлов</p>
              ) : (
                files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setFileName(file.name);
                      setCode(file.content);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      fileName === file.name
                        ? 'bg-premium-600 text-white'
                        : 'hover:bg-premium-900 text-gray-300'
                    }`}
                  >
                    📄 {file.name}
                  </button>
                ))
              )}
            </div>

            {files.length === 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Текущий файл:</p>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="input-premium w-full text-sm"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {!showFileExplorer && (
            <button
              onClick={() => setShowFileExplorer(true)}
              className="absolute top-4 left-4 z-10 btn-premium text-sm"
            >
              📁 Файлы
            </button>
          )}

          <div className="flex-1 monaco-editor-container">
            <Editor
              height="100%"
              language={getMonacoLanguage()}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderWhitespace: 'selection',
                fontFamily: 'Fira Code, monospace',
                fontLigatures: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          {/* Terminal */}
          {showTerminal && compilationResult && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="h-48 glass-dark border-t border-premium-500/20 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Результат компиляции</h3>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <pre className={`text-sm font-mono ${
                compilationResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {compilationResult.output || compilationResult.error}
              </pre>

              {compilationResult.warnings && compilationResult.warnings.length > 0 && (
                <div className="mt-2 text-yellow-400 text-sm">
                  <strong>Предупреждения:</strong>
                  <ul className="list-disc list-inside">
                    {compilationResult.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-dark border-t border-premium-500/20 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>📄 {fileName}</span>
          <span>🌐 {language.toUpperCase()}</span>
          <span>📊 Строк: {code.split('\n').length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>✨ Coder-Pawno v1.0</span>
          <span>🎯 Premium Design 2026</span>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
