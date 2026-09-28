import React, { useState } from 'react';
import { 
  Terminal, 
  Trash2, 
  Filter, 
  Download, 
  Search, 
  Check, 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { LogEntry } from '../types/carplay';

interface ConsoleLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs, onClearLogs }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tags = ['all', 'CarPlay', 'ScreenCapture', 'ReplayKit', 'VideoPipeline', 'Connection', 'Performance'];

  const filteredLogs = logs.filter((log) => {
    const matchesTag = selectedTag === 'all' || log.tag === selectedTag;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const getTagBadgeStyle = (tag: string) => {
    switch (tag) {
      case 'CarPlay': return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'ScreenCapture': return 'bg-indigo-950 text-indigo-400 border-indigo-800';
      case 'ReplayKit': return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'VideoPipeline': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'Connection': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Performance': return 'bg-rose-950 text-rose-400 border-rose-800';
      default: return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default: return <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[320px] font-mono text-xs shadow-xl">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-neutral-200">System Logs (Unified Apple os.Logger)</span>
          <span className="text-[10px] text-neutral-500">
            ({filteredLogs.length} events)
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1.5 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 w-36"
            />
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Badges Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-neutral-900 text-[11px]">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2 py-0.5 rounded-md transition border ${
              selectedTag === tag
                ? 'bg-neutral-800 text-white border-neutral-600 font-semibold'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-850 hover:bg-neutral-850'
            }`}
          >
            {tag === 'all' ? 'All Tags' : `[${tag}]`}
          </button>
        ))}
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 overflow-y-auto space-y-1 py-2 font-mono text-[11px] select-text">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            No log entries matching the criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id}
              className="flex items-start gap-2 py-0.5 hover:bg-neutral-900/60 px-1 rounded transition"
            >
              <span className="text-neutral-500 shrink-0">{log.timestamp}</span>
              {getLevelIcon(log.level)}
              <span className={`px-1.5 py-0.2 rounded border text-[10px] shrink-0 font-medium ${getTagBadgeStyle(log.tag)}`}>
                [{log.tag}]
              </span>
              <span className={`break-all ${
                log.level === 'error' ? 'text-rose-300' :
                log.level === 'warning' ? 'text-amber-300' : 'text-neutral-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
