import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Construction, 
  Car, 
  AlertTriangle,
  SignalIcon,
  Paintbrush,
  Zap,
  Clock,
  CheckCircle,
  Eye,
  Calendar,
  MapPin,
  Search,
  Globe
} from "lucide-react";

const mockReports = [
  {
    id: "CIV-123456",
    type: "pothole",
    title: "Large pothole on Main Street",
    location: "Main St & 1st Ave",
    date: "2024-01-15",
    status: "fixed",
    description: "Deep pothole causing damage to vehicles",
    cityResponse: "Pothole has been filled with asphalt. Thank you for reporting!"
  },
  {
    id: "CIV-123457",
    type: "light-out",
    title: "Street light not working",
    location: "Oak Park, near playground",
    date: "2024-01-10",
    status: "scheduled",
    description: "Street light has been out for several days, creating safety concerns",
    cityResponse: "Repair scheduled for next Tuesday between 9-11 AM"
  },
  {
    id: "CIV-123458",
    type: "sidewalk-crack",
    title: "Cracked sidewalk creating trip hazard",
    location: "Elm Street sidewalk",
    date: "2024-01-08",
    status: "in-review",
    description: "Large crack in sidewalk that could cause people to trip",
    cityResponse: null
  },
  {
    id: "CIV-123459",
    type: "graffiti",
    title: "Graffiti on bus stop",
    location: "5th Ave Bus Stop",
    date: "2024-01-05",
    status: "received",
    description: "Inappropriate graffiti on the main bus stop shelter",
    cityResponse: null
  }
];

const issueIcons = {
  "pothole": Construction,
  "road-damage": Car,
  "sidewalk-crack": Construction,
  "faded-striping": AlertTriangle,
  "drain-clogged": AlertTriangle,
  "missing-sign": SignalIcon,
  "graffiti": Paintbrush,
  "light-out": Zap,
};

const statusConfig = {
  "received": { 
    label: { en: "Received", es: "Recibido" }, 
    icon: Clock, 
    color: "bg-blue-100 text-blue-700",
    description: { en: "We've received your report", es: "Hemos recibido tu reporte" }
  },
  "in-review": { 
    label: { en: "In Review", es: "En Revisión" }, 
    icon: Eye, 
    color: "bg-yellow-100 text-yellow-700",
    description: { en: "Our team is reviewing the issue", es: "Nuestro equipo está revisando el problema" }
  },
  "scheduled": { 
    label: { en: "Scheduled", es: "Programado" }, 
    icon: Calendar, 
    color: "bg-orange-100 text-orange-700",
    description: { en: "Repair work has been scheduled", es: "El trabajo de reparación ha sido programado" }
  },
  "fixed": { 
    label: { en: "Fixed", es: "Arreglado" }, 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-700",
    description: { en: "Issue has been resolved", es: "El problema ha sido resuelto" }
  }
};

export default function CitizenHistory() {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [searchTerm, setSearchTerm] = useState("");

  const content = {
    en: {
      title: "My Reports",
      subtitle: "Track the status of your infrastructure reports",
      searchPlaceholder: "Search your reports...",
      noReports: "No reports found",
      noReportsDesc: "You haven't submitted any reports yet.",
      reportNew: "Report New Issue",
      reportNumber: "Report #",
      submittedOn: "Submitted on",
      cityResponse: "City Response",
      noCityResponse: "No response yet",
    },
    es: {
      title: "Mis Reportes",
      subtitle: "Rastrea el estado de tus reportes de infraestructura",
      searchPlaceholder: "Buscar en tus reportes...",
      noReports: "No se encontraron reportes",
      noReportsDesc: "Aún no has enviado ningún reporte.",
      reportNew: "Reportar Nuevo Problema",
      reportNumber: "Reporte #",
      submittedOn: "Enviado el",
      cityResponse: "Respuesta de la Ciudad",
      noCityResponse: "Sin respuesta aún",
    }
  };

  const t = content[language];

  const filteredReports = mockReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-civic-gray-light">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-civic-blue rounded-lg flex items-center justify-center">
                <Construction className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Fix My City</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "Español" : "English"}</span>
            </Button>
            
            <Link to="/">
              <Button className="bg-civic-blue hover:bg-civic-blue/90">
                {t.reportNew}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-civic-gray text-lg">{t.subtitle}</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray w-4 h-4" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Construction className="w-16 h-16 text-civic-gray mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{t.noReports}</h3>
                <p className="text-civic-gray mb-6">{t.noReportsDesc}</p>
                <Link to="/">
                  <Button className="bg-civic-blue hover:bg-civic-blue/90">
                    {t.reportNew}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredReports.map((report) => {
                const status = statusConfig[report.status as keyof typeof statusConfig];
                const Icon = issueIcons[report.type as keyof typeof issueIcons];
                const StatusIcon = status.icon;
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-civic-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-civic-blue" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <CardTitle className="text-lg">{report.title}</CardTitle>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-civic-gray mb-2">
                              <span className="flex items-center space-x-1">
                                <span className="font-medium">{t.reportNumber}</span>
                                <span>{report.id}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{t.submittedOn} {new Date(report.date).toLocaleDateString()}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-sm text-civic-gray">
                              <MapPin className="w-4 h-4" />
                              <span>{report.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={`${status.color} flex items-center space-x-1`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label[language]}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-civic-gray mb-4">{report.description}</p>
                      
                      {report.cityResponse ? (
                        <div className="bg-civic-blue-light/20 rounded-lg p-4">
                          <h4 className="font-semibold text-foreground mb-2">{t.cityResponse}</h4>
                          <p className="text-civic-gray">{report.cityResponse}</p>
                        </div>
                      ) : (
                        <div className="bg-civic-gray-light/30 rounded-lg p-4">
                          <p className="text-civic-gray italic">{t.noCityResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
