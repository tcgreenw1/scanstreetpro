import { useState, useEffect } from 'react';
import { Search, Users, Calculator, FileText, MapPin, Clock, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'contractor' | 'inspection' | 'report' | 'asset';
  href: string;
  icon: React.ReactNode;
  lastUpdated?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Cost Estimator',
    description: 'PCI-based cost projections and budget planning',
    type: 'page',
    href: '/estimates',
    icon: <Calculator className="w-4 h-4" />
  },
  {
    id: '2',
    title: 'Premier Paving Co.',
    description: 'Certified contractor with 4.8/5 rating',
    type: 'contractor',
    href: '/contractors',
    icon: <Users className="w-4 h-4" />,
    lastUpdated: '2 days ago'
  },
  {
    id: '3',
    title: 'Main Street Inspection',
    description: 'Completed inspection report - Score: 72',
    type: 'inspection',
    href: '/inspections',
    icon: <FileText className="w-4 h-4" />,
    lastUpdated: '1 week ago'
  },
  {
    id: '4',
    title: 'Budget Planning',
    description: '5-10 year infrastructure investment planning',
    type: 'page',
    href: '/budget',
    icon: <Building className="w-4 h-4" />
  },
  {
    id: '5',
    title: 'School Zone Assets',
    description: 'Sidewalks and pedestrian infrastructure',
    type: 'asset',
    href: '/assets',
    icon: <MapPin className="w-4 h-4" />,
    lastUpdated: '3 days ago'
  }
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate search delay
    const timer = setTimeout(() => {
      const filtered = mockSearchResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contractor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspection':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'report':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'asset':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <Card className="w-full max-w-2xl glass-card border-white/20 animate-scale-up">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search pages, contractors, inspections, assets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 glass-card border-white/30 text-lg"
                autoFocus
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                ESC
              </Button>
            </div>

            {query && (
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-shimmer h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          to={result.href}
                          onClick={onClose}
                          className="block p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-slate-800 dark:text-white truncate">
                                  {result.title}
                                </h4>
                                <Badge className={cn("text-xs", getTypeColor(result.type))}>
                                  {result.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {result.description}
                              </p>
                              {result.lastUpdated && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span className="text-xs text-slate-500">
                                    Updated {result.lastUpdated}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">No results found</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Try searching for contractors, inspections, or pages
                    </p>
                  </div>
                )}
              </div>
            )}

            {!query && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 dark:text-white">Quick Access</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'New Inspection', href: '/inspections/new', icon: FileText },
                    { name: 'Cost Estimator', href: '/estimates', icon: Calculator },
                    { name: 'Contractors', href: '/contractors', icon: Users },
                    { name: 'Map View', href: '/map', icon: MapPin }
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-2 p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
