import { Gauge } from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { SPEED_TIERS } from '../constants/speedTiers';

export default function SpeedController() {
  const { playbackSpeed, setGlobalSpeed } = useAlgorithmStore();

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
      <div className="flex items-center gap-1.5 mr-1">
        <Gauge size={12} className="text-text-muted" />
        <span className="text-[8px] font-mono text-text-muted uppercase font-bold tracking-tighter">Speed</span>
      </div>
      <div className="flex gap-1">
        {Object.keys(SPEED_TIERS).map((key) => (
          <button
            key={key}
            onClick={() => setGlobalSpeed(key)}
            className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all ${
              playbackSpeed === key 
                ? 'bg-accent-green text-black font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)] scale-105' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
