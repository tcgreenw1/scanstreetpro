import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Camera, 
  Upload, 
  Construction, 
  TreePine, 
  SignalIcon, 
  Zap, 
  Car, 
  AlertTriangle,
  Paintbrush,
  Globe,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import ReportIssueForm from "../components/ReportIssueForm";

const issueTypes = [
  { id: "pothole", label: "Pothole", icon: Construction, color: "bg-orange-100 text-orange-600" },
  { id: "road-damage", label: "Road Damage", icon: Car, color: "bg-red-100 text-red-600" },
  { id: "sidewalk-crack", label: "Sidewalk Crack", icon: Construction, color: "bg-yellow-100 text-yellow-600" },
  { id: "faded-striping", label: "Faded Striping", icon: AlertTriangle, color: "bg-blue-100 text-blue-600" },
  { id: "drain-clogged", label: "Drain Clogged", icon: AlertTriangle, color: "bg-cyan-100 text-cyan-600" },
  { id: "missing-sign", label: "Missing Sign", icon: SignalIcon, color: "bg-purple-100 text-purple-600" },
  { id: "graffiti", label: "Graffiti", icon: Paintbrush, color: "bg-pink-100 text-pink-600" },
  { id: "light-out", label: "Light Out", icon: Zap, color: "bg-amber-100 text-amber-600" },
];

const statuses = [
  { label: "Received", icon: CheckCircle, color: "text-civic-blue" },
  { label: "In Review", icon: Eye, color: "text-warning" },
  { label: "Scheduled", icon: Clock, color: "text-info" },
  { label: "Fixed", icon: CheckCircle, color: "text-success" },
];

export default function Index() {
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");

  const content = {
    en: {
      title: "Fix My City",
      subtitle: "Report infrastructure issues in your community",
      description: "Help us keep your city safe and beautiful by reporting potholes, broken sidewalks, damaged signs, and more.",
      reportButton: "Report an Issue",
      viewHistory: "View My Reports",
      howItWorks: "How It Works",
      step1: "Report the Issue",
      step1Desc: "Take a photo and describe the problem",
      step2: "We Review",
      step2Desc: "City staff reviews and prioritizes your report",
      step3: "Track Progress",
      step3Desc: "Get updates on the status of your report",
      issueTypes: "Common Issues",
      recentReports: "Recent Community Reports",
      cityDashboard: "City Dashboard",
      adminAccess: "Premium city management tools"
    },
    es: {
      title: "Arregla Mi Ciudad",
      subtitle: "Reporta problemas de infraestructura en tu comunidad",
      description: "Ayúdanos a mantener tu ciudad segura y hermosa reportando baches, aceras rotas, señales dañadas y más.",
      reportButton: "Reportar un Problema",
      viewHistory: "Ver Mis Reportes",
      howItWorks: "Cómo Funciona",
      step1: "Reporta el Problema",
      step1Desc: "Toma una foto y describe el problema",
      step2: "Revisamos",
      step2Desc: "El personal de la ciudad revisa y prioriza tu reporte",
      step3: "Sigue el Progreso",
      step3Desc: "Recibe actualizaciones sobre el estado de tu reporte",
      issueTypes: "Problemas Comunes",
      recentReports: "Reportes Recientes de la Comunidad",
      cityDashboard: "Panel de la Ciudad",
      adminAccess: "Herramientas premium de gestión municipal"
    }
  };

  const t = content[language];

  if (showForm) {
    return <ReportIssueForm onBack={() => setShowForm(false)} language={language} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-civic-gray-light bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-civic-blue rounded-lg flex items-center justify-center hover-lift">
              <Construction className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{t.title}</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <Globe className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{language === "en" ? "Español" : "English"}</span>
              <span className="sm:hidden">{language === "en" ? "ES" : "EN"}</span>
            </Button>

            <Link to="/history">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <span className="hidden sm:inline">{t.viewHistory}</span>
                <span className="sm:hidden">History</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-civic-blue-light to-civic-purple-light py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-civic-gray mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center max-w-lg mx-auto">
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="bg-civic-blue hover:bg-civic-blue/90 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg hover-lift w-full sm:w-auto"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              {t.reportButton}
            </Button>

            <Link to="/history" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg hover-lift w-full">
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t.viewHistory}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Issue Types Grid */}
      <section className="py-12 md:py-16 bg-civic-gray-light/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{t.issueTypes}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {issueTypes.map((issue, index) => {
              const IconComponent = issue.icon;
              return (
                <Card key={issue.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover-lift animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${issue.color} flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm md:text-base">{issue.label}</h4>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{t.howItWorks}</h3>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center hover-lift">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-civic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Camera className="w-6 h-6 md:w-8 md:h-8 text-civic-blue" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t.step1}</h4>
                <p className="text-civic-gray text-sm md:text-base">{t.step1Desc}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-civic-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Eye className="w-6 h-6 md:w-8 md:h-8 text-civic-purple" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t.step2}</h4>
                <p className="text-civic-gray text-sm md:text-base">{t.step2Desc}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-success" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t.step3}</h4>
                <p className="text-civic-gray text-sm md:text-base">{t.step3Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* City Dashboard CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-civic-blue to-civic-purple">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">{t.cityDashboard}</h3>
            <p className="text-white/90 mb-6 md:mb-8 text-base md:text-lg">
              {t.adminAccess}
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                Dashboard & Analytics
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                Map View
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                Export Reports
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                QR Code Generator
              </Badge>
            </div>

            <Link to="/admin">
              <Button variant="secondary" size="lg" className="bg-white text-civic-blue hover:bg-white/90 hover-lift px-6 md:px-8 py-3 md:py-4">
                Learn More About Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 border-t border-civic-gray-light bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-civic-gray text-sm md:text-base">
            &copy; 2024 {t.title}. Helping communities build better infrastructure together.
          </p>
        </div>
      </footer>
    </div>
  );
}
