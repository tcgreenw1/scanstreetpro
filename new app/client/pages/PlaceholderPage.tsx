import { Construction, ArrowRight } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoonFeatures?: string[];
}

export function PlaceholderPage({ title, description, comingSoonFeatures }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen pt-24 relative">
      {/* Background particles */}
      <div className="floating-particles"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="glass-card p-12 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Construction className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-300 font-medium">
              <Construction className="w-5 h-5 mr-2" />
              Coming Soon
            </div>
          </div>

          {/* Features Preview */}
          {comingSoonFeatures && comingSoonFeatures.length > 0 && (
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What's Coming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comingSoonFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <ArrowRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8">
            <p className="text-gray-400 mb-4">
              Want to be notified when this feature is ready?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Notified
              </button>
              <button className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-200">
                Back to Grants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
