import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Camera, 
  Upload, 
  X,
  Construction, 
  Car, 
  AlertTriangle,
  SignalIcon,
  Paintbrush,
  Zap,
  CheckCircle
} from "lucide-react";

interface ReportIssueFormProps {
  onBack: () => void;
  language: "en" | "es";
}

const issueTypes = [
  { id: "pothole", label: { en: "Pothole", es: "Bache" }, icon: Construction },
  { id: "road-damage", label: { en: "Road Damage", es: "Daño en la Carretera" }, icon: Car },
  { id: "sidewalk-crack", label: { en: "Sidewalk Crack", es: "Grieta en la Acera" }, icon: Construction },
  { id: "faded-striping", label: { en: "Faded Striping", es: "Señalización Desgastada" }, icon: AlertTriangle },
  { id: "drain-clogged", label: { en: "Drain Clogged", es: "Drenaje Obstruido" }, icon: AlertTriangle },
  { id: "missing-sign", label: { en: "Missing Sign", es: "Señal Faltante" }, icon: SignalIcon },
  { id: "graffiti", label: { en: "Graffiti", es: "Grafiti" }, icon: Paintbrush },
  { id: "light-out", label: { en: "Light Out", es: "Luz Fundida" }, icon: Zap },
];

export default function ReportIssueForm({ onBack, language }: ReportIssueFormProps) {
  const [formData, setFormData] = useState({
    issueType: "",
    location: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    notifyWhenResolved: false,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = {
    en: {
      title: "Report an Issue",
      subtitle: "Help us fix problems in your community",
      issueType: "What type of issue are you reporting?",
      location: "Location",
      locationPlaceholder: "Enter address or cross streets",
      locationHelper: "Be as specific as possible to help us locate the issue",
      photos: "Photos (Optional)",
      photosHelper: "Upload up to 3 photos to help us understand the issue",
      description: "Description",
      descriptionPlaceholder: "Describe the issue in detail...",
      contactInfo: "Contact Information",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number (Optional)",
      phoneHelper: "We may need to contact you for clarification",
      notifyCheckbox: "Notify me when this issue is resolved",
      submitButton: "Submit Report",
      submittingButton: "Submitting...",
      backButton: "Back to Home",
      successTitle: "Report Submitted Successfully!",
      successMessage: "Thank you for helping improve our community. We'll review your report and get back to you soon.",
      reportNumber: "Report Number",
      nextSteps: "What happens next?",
      step1: "We'll review your report within 2 business days",
      step2: "If needed, we'll contact you for more information",
      step3: "You'll receive updates on the progress",
      step4: "We'll notify you when the issue is resolved",
    },
    es: {
      title: "Reportar un Problema",
      subtitle: "Ayúdanos a arreglar problemas en tu comunidad",
      issueType: "¿Qué tipo de problema estás reportando?",
      location: "Ubicación",
      locationPlaceholder: "Ingresa dirección o calles de referencia",
      locationHelper: "Sé lo más específico posible para ayudarnos a localizar el problema",
      photos: "Fotos (Opcional)",
      photosHelper: "Sube hasta 3 fotos para ayudarnos a entender el problema",
      description: "Descripción",
      descriptionPlaceholder: "Describe el problema en detalle...",
      contactInfo: "Información de Contacto",
      name: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono (Opcional)",
      phoneHelper: "Podríamos necesitar contactarte para aclaraciones",
      notifyCheckbox: "Notificarme cuando este problema sea resuelto",
      submitButton: "Enviar Reporte",
      submittingButton: "Enviando...",
      backButton: "Volver al Inicio",
      successTitle: "¡Reporte Enviado Exitosamente!",
      successMessage: "Gracias por ayudar a mejorar nuestra comunidad. Revisaremos tu reporte y te contactaremos pronto.",
      reportNumber: "Número de Reporte",
      nextSteps: "¿Qué sigue?",
      step1: "Revisaremos tu reporte dentro de 2 días hábiles",
      step2: "Si es necesario, te contactaremos para más información",
      step3: "Recibirás actualizaciones sobre el progreso",
      step4: "Te notificaremos cuando el problema sea resuelto",
    }
  };

  const t = content[language];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length <= 3) {
      setPhotos([...photos, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const reportNumber = `CIV-${Date.now().toString().slice(-6)}`;
    
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-civic-gray-light bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 hover-lift">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm md:text-base">{t.backButton}</span>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">{t.successTitle}</h1>
            <p className="text-civic-gray mb-8 text-lg">{t.successMessage}</p>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <Label className="text-sm font-medium text-civic-gray">{t.reportNumber}</Label>
                  <div className="text-2xl font-bold text-civic-blue mt-1">{reportNumber}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.nextSteps}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-civic-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-civic-gray">{t.step1}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-civic-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-civic-gray">{t.step2}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-civic-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-civic-gray">{t.step3}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-civic-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-civic-gray">{t.step4}</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Button onClick={onBack} size="lg" className="bg-civic-blue hover:bg-civic-blue/90">
                {t.backButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-civic-gray-light bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 hover-lift">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">{t.backButton}</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-civic-gray text-base md:text-lg">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Issue Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Construction className="w-5 h-5 text-civic-blue" />
                  <span>{t.issueType}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.issueType} onValueChange={(value) => setFormData({...formData, issueType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((issue) => (
                      <SelectItem key={issue.id} value={issue.id}>
                        <div className="flex items-center space-x-2">
                          <issue.icon className="w-4 h-4" />
                          <span>{issue.label[language]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-civic-blue" />
                  <span>{t.location}</span>
                </CardTitle>
                <CardDescription>{t.locationHelper}</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={t.locationPlaceholder}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-civic-blue" />
                  <span>{t.photos}</span>
                </CardTitle>
                <CardDescription>{t.photosHelper}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {photos.length < 3 && (
                    <div className="border-2 border-dashed border-civic-gray-light rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-civic-gray mx-auto mb-2" />
                      <Label htmlFor="photo-upload" className="cursor-pointer text-civic-blue hover:text-civic-blue/80">
                        Click to upload photos
                      </Label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  )}
                  
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 md:h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-2 h-2 md:w-3 md:h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>{t.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t.descriptionPlaceholder}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <p className="text-sm text-civic-gray mt-1">{t.phoneHelper}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify"
                    checked={formData.notifyWhenResolved}
                    onCheckedChange={(checked) => setFormData({...formData, notifyWhenResolved: !!checked})}
                  />
                  <Label htmlFor="notify" className="text-sm">{t.notifyCheckbox}</Label>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-civic-blue hover:bg-civic-blue/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t.submittingButton : t.submitButton}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
