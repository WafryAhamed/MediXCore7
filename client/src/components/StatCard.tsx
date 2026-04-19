
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  delay?: number;
}
export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay = 0
}: StatCardProps) {
  const colorMap: Record<
    string,
    {
      bg: string;
      text: string;
      ring: string;
    }> =
  {
    accent: {
      bg: 'bg-accent/10',
      text: 'text-accent',
      ring: 'ring-accent/20'
    },
    highlight: {
      bg: 'bg-highlight/10',
      text: 'text-highlight',
      ring: 'ring-highlight/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      ring: 'ring-purple-500/20'
    },
    green: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      ring: 'ring-emerald-500/20'
    }
  };
  const colors = colorMap[color] || colorMap.accent;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay
      }}
      whileHover={{
        y: -2
      }}
      className="glass-card rounded-xl p-5 ring-1 ring-inset ring-white/5">
      
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ring-1 ${colors.ring}`}>
          
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        {trend &&
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        }
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-textLight">{value}</p>
        <p className="text-sm text-textMuted mt-0.5">{label}</p>
      </div>
    </motion.div>);

}
