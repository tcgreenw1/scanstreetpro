import { Clock, DollarSign, MapPin, Tag } from 'lucide-react';

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  status: 'open' | 'closed' | 'soon';
  agency: string;
  agencyLogo: string;
  eligibleEntities: string[];
  tags: string[];
  location: string;
  category: string;
}

interface GrantCardProps {
  grant: Grant;
}

export function GrantCard({ grant }: GrantCardProps) {
  const statusColors = {
    open: 'bg-green-500/20 text-green-300 border-green-500/30',
    closed: 'bg-red-500/20 text-red-300 border-red-500/30',
    soon: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="glass-card p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {grant.agency.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
              {grant.title}
            </h3>
            <p className="text-sm text-gray-400">{grant.agency}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[grant.status]}`}>
          {grant.status.toUpperCase()}
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {grant.description}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-white font-medium">{grant.amount}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className="text-gray-300">Due: {formatDeadline(grant.deadline)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">{grant.location}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">Eligible</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {grant.eligibleEntities.map((entity, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30">
              {entity}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {grant.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md border border-purple-500/30">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
