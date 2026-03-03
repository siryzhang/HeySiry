
import React, { useState, useRef } from 'react';
import { Terminal, Loader2, Sparkles, Upload, FileSpreadsheet, Globe, Link2, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Language } from '../types';

interface Props {
  onAnalyze: (data: string) => Promise<void>;
  isAnalyzing: boolean;
  language: Language;
}

type InputMode = 'terminal' | 'upload' | 'api';

const InputConsole: React.FC<Props> = ({ onAnalyze, isAnalyzing, language }) => {
  const [mode, setMode] = useState<InputMode>('terminal');
  const [input, setInput] = useState('');
  
  // File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API State
  const [apiUrl, setApiUrl] = useState('');
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    onAnalyze(input);
    if (mode === 'terminal') setInput('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      alert("Invalid format. Please upload .xlsx, .xls or .csv");
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const dataString = `[SYSTEM UPLOAD: EXCEL DATA IMPORT]\nFILENAME: ${file.name}\nCONTENT:\n${JSON.stringify(jsonData.slice(0, 50), null, 2)}`;
        
        onAnalyze(dataString).then(() => {
             setFileName(null);
             if (fileInputRef.current) fileInputRef.current.value = "";
        });
      } catch (err) {
        console.error(err);
        alert("Failed to parse file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleApiConnect = async () => {
      if (!apiUrl) return;
      setApiStatus('connecting');
      
      setTimeout(() => {
          setApiStatus('connected');
          const mockData = `[SYSTEM: API STREAM CONNECTED]\nSOURCE: ${apiUrl}\nDATA PAYLOAD: User activity logs indicate high proficiency in automated debugging tools. 34 Commits referenced 'Copilot' assistance with zero regression errors. Peer review scores in 'Innovation' increased by 15% this quarter.`;
          
          setTimeout(() => {
              onAnalyze(mockData);
              setApiStatus('idle');
              setApiUrl('');
          }, 1500);
      }, 1500);
  };

  const placeholdersEn = [
    "Paste a recent project summary...",
    "Copy a transcript of a technical debate...",
    "Describe how they handled a recent AI hallucination...",
    "Input feedback from a code review..."
  ];

  const placeholdersZh = [
    "粘贴最近的项目摘要...",
    "复制一段技术讨论的记录...",
    "描述他们如何处理最近的 AI 幻觉...",
    "输入代码审查的反馈..."
  ];

  const currentPlaceholders = language === 'en' ? placeholdersEn : placeholdersZh;
  const [placeholder] = useState(currentPlaceholders[Math.floor(Math.random() * currentPlaceholders.length)]);

  return (
    <div className="w-full">
        
        {/* Compact Tab Navigation */}
        <div className="flex gap-1 mb-0 ml-1">
            <button 
                onClick={() => setMode('terminal')}
                className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-t border-t border-x transition-all ${
                    mode === 'terminal' 
                    ? 'bg-slate-900 border-slate-700 text-cyan-400 translate-y-px' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                <Terminal className="w-3 h-3" /> {language === 'en' ? 'Terminal' : '终端'}
            </button>
            <button 
                onClick={() => setMode('upload')}
                className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-t border-t border-x transition-all ${
                    mode === 'upload' 
                    ? 'bg-slate-900 border-slate-700 text-cyan-400 translate-y-px' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                <FileSpreadsheet className="w-3 h-3" /> {language === 'en' ? 'Upload' : '上传'}
            </button>
            <button 
                onClick={() => setMode('api')}
                className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-t border-t border-x transition-all ${
                    mode === 'api' 
                    ? 'bg-slate-900 border-slate-700 text-cyan-400 translate-y-px' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                <Globe className="w-3 h-3" /> {language === 'en' ? 'Neural Link' : '神经链接'}
            </button>
        </div>

        {/* Main Console Box - Compact Height */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-lg rounded-tl-none p-1 shadow-inner relative overflow-hidden min-h-[140px]">
            
            {/* TERMINAL MODE */}
            {mode === 'terminal' && (
                <form onSubmit={handleSubmit} className="relative h-full flex flex-col">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-24 bg-transparent text-slate-300 p-3 font-mono text-xs focus:outline-none resize-none placeholder-slate-700"
                        disabled={isAnalyzing}
                    />
                    <div className="flex justify-between items-center px-3 pb-2 bg-slate-900/30 pt-2 border-t border-slate-800/50">
                        <span className="text-[10px] text-slate-600 font-mono">
                            {language === 'en' ? 'INPUT_STREAM // READY' : '输入流 // 就绪'}
                        </span>
                         <button
                            type="submit"
                            disabled={!input.trim() || isAnalyzing}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded font-medium text-xs transition-all duration-300 ${
                                !input.trim() || isAnalyzing
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(8,145,178,0.3)]'
                            }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    {language === 'en' ? 'PROCESSING' : '处理中'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3 h-3" />
                                    {language === 'en' ? 'ANALYZE' : '分析'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* UPLOAD MODE */}
            {mode === 'upload' && (
                <div 
                    className={`h-32 flex flex-col items-center justify-center border-2 border-dashed rounded m-1 transition-colors ${
                        dragActive ? 'border-cyan-500 bg-cyan-900/10' : 'border-slate-800 bg-slate-900/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center text-cyan-400 animate-pulse">
                             <FileSpreadsheet className="w-6 h-6 mb-2" />
                             <span className="text-xs font-mono tracking-widest">
                                 {language === 'en' ? 'PARSING...' : '解析中...'}
                             </span>
                        </div>
                    ) : fileName ? (
                        <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" />
                            <p className="text-slate-300 font-medium text-xs mb-1">{fileName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                                {language === 'en' ? 'Ready to process' : '准备处理'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-5 h-5 text-slate-500 mb-2" />
                            <p className="text-slate-300 text-xs font-medium mb-1">
                                {language === 'en' ? 'Drag Excel / CSV' : '拖拽 Excel / CSV'}
                            </p>
                            <label className="cursor-pointer px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] uppercase tracking-wider font-bold rounded border border-slate-700 transition-colors">
                                {language === 'en' ? 'Browse' : '浏览'}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    className="hidden" 
                                    accept=".xlsx,.xls,.csv" 
                                    onChange={handleFileChange}
                                />
                            </label>
                        </>
                    )}
                </div>
            )}

            {/* API MODE */}
            {mode === 'api' && (
                <div className="h-32 p-4 flex flex-col justify-center">
                     <div className="flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link2 className="h-3 w-3 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                placeholder="https://api.hr-data.corp/v1..."
                                className="block w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                                disabled={apiStatus === 'connecting'}
                            />
                        </div>
                        <button
                            onClick={handleApiConnect}
                            disabled={!apiUrl || apiStatus === 'connecting'}
                            className="bg-cyan-900/30 border border-cyan-800 hover:bg-cyan-800/50 text-cyan-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            {apiStatus === 'connecting' 
                                ? (language === 'en' ? 'Linking...' : '连接中...') 
                                : (language === 'en' ? 'Connect' : '连接')
                            }
                        </button>
                     </div>
                     <p className="mt-2 text-[10px] text-slate-600 font-mono text-center">
                        {language === 'en' ? '* Simulates secure handshake to external HRIS' : '* 模拟外部 HRIS 的安全握手'}
                     </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default InputConsole;
