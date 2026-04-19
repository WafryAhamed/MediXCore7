
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  DownloadIcon,
  ShareIcon,
  ShieldCheckIcon,
  HashIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  ClipboardIcon } from
'lucide-react';
interface RecordData {
  id: string;
  type: string;
  diagnosis: string;
  doctor: string;
  hospital: string;
  date: string;
  notes: string;
  status: 'verified' | 'pending';
  blockchainHash: string;
  blockNumber: number;
  fileType: string;
  fileSize: string;
}
interface RecordDetailModalProps {
  record: RecordData | null;
  isOpen: boolean;
  onClose: () => void;
}
export function RecordDetailModal({
  record,
  isOpen,
  onClose
}: RecordDetailModalProps) {
  if (!record) return null;
  const copyHash = () => {
    navigator.clipboard?.writeText(record.blockchainHash);
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        onClick={onClose}>
        
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          transition={{
            duration: 0.2
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/30 max-h-[85vh] overflow-y-auto">
          
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5 text-highlight" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-textLight">
                    {record.diagnosis}
                  </h3>
                  <p className="text-sm text-textMuted">{record.type}</p>
                </div>
              </div>
              <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-textMuted hover:text-textLight transition-colors"
              aria-label="Close modal">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-textMuted">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span className="text-xs uppercase tracking-wider">
                      Doctor
                    </span>
                  </div>
                  <p className="text-sm font-medium text-textLight">
                    {record.doctor}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-textMuted">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span className="text-xs uppercase tracking-wider">
                      Date
                    </span>
                  </div>
                  <p className="text-sm font-medium text-textLight">
                    {record.date}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-textMuted">
                    Hospital
                  </span>
                  <p className="text-sm font-medium text-textLight">
                    {record.hospital}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-textMuted">
                    File
                  </span>
                  <p className="text-sm font-medium text-textLight">
                    {record.fileType} · {record.fileSize}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-textMuted">
                  Notes
                </span>
                <p className="text-sm text-textLight/80 leading-relaxed bg-white/[0.03] rounded-lg p-3 border border-border">
                  {record.notes}
                </p>
              </div>

              {/* Blockchain Verification */}
              <div className="rounded-xl bg-accent/5 border border-accent/10 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">
                    Blockchain Verified
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-textMuted">
                      Transaction Hash
                    </span>
                    <button
                    onClick={copyHash}
                    className="flex items-center gap-1 text-xs text-highlight hover:text-highlight/80 transition-colors">
                    
                      <ClipboardIcon className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
                    <HashIcon className="w-3.5 h-3.5 text-textMuted flex-shrink-0" />
                    <code className="text-xs text-textLight/70 truncate font-mono">
                      {record.blockchainHash}
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-xs text-textMuted">
                    <span>Block #{record.blockNumber.toLocaleString()}</span>
                    <span>{record.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 p-5 border-t border-border">
              <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-highlight hover:bg-highlight/90 text-white font-medium text-sm rounded-lg transition-colors">
              
                <DownloadIcon className="w-4 h-4" />
                Download
              </motion.button>
              <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-primary font-medium text-sm rounded-lg transition-colors">
              
                <ShareIcon className="w-4 h-4" />
                Share
              </motion.button>
              <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={onClose}
              className="px-4 py-2.5 text-textMuted hover:text-textLight text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
              
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}
