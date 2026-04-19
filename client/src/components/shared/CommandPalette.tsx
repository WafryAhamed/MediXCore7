import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Stethoscope, FileText, Calendar } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { apiClient } from '../../lib/api/client';
import { API_URLS } from '../../lib/constants';
import type { SearchResult, ApiResponse } from '../../types';


const categoryIcons: Record<string, React.ElementType> = {
  patient: Users,
  doctor: Stethoscope,
  appointment: Calendar,
  page: FileText,
};

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const { commandPaletteOpen, toggleCommandPalette } = useUiStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<ApiResponse<SearchResult[]>>(
          `${API_URLS.SEARCH}?q=${encodeURIComponent(query)}`
        );
        const data = response as unknown as ApiResponse<SearchResult[]>;
        setResults(data.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      navigate(result.url);
      toggleCommandPalette();
      setQuery('');
    },
    [navigate, toggleCommandPalette]
  );

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              toggleCommandPalette();
              setQuery('');
            }}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <Command
              className="rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
              shouldFilter={false}
            >
              <div className="flex items-center gap-3 border-b border-slate-700/50 px-4">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search patients, doctors, pages..."
                  className="flex-1 bg-transparent py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-72 overflow-y-auto p-2">
                {loading && (
                  <Command.Loading>
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      Searching...
                    </div>
                  </Command.Loading>
                )}
                {!loading && query && results.length === 0 && (
                  <Command.Empty className="px-4 py-8 text-center text-sm text-slate-500">
                    No results found for "{query}"
                  </Command.Empty>
                )}
                {!loading && !query && (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    Start typing to search...
                  </div>
                )}
                {Object.entries(grouped).map(([type, items]) => {
                  const Icon = categoryIcons[type] || FileText;
                  return (
                    <Command.Group
                      key={type}
                      heading={
                        <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium uppercase text-slate-500">
                          <Icon className="h-3.5 w-3.5" />
                          {type}s
                        </div>
                      }
                    >
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={item.id}
                          onSelect={() => handleSelect(item)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 cursor-pointer hover:bg-slate-800 aria-selected:bg-slate-800"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{item.title}</p>
                            {item.subtitle && (
                              <p className="truncate text-xs text-slate-400">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
