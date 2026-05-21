import { ProfileCard } from "@/components/public/profile-card";
import {
  Building2,
  GraduationCap,
  Landmark,
  BarChart3,
  Hotel,
  Plane,
  FileText,
  TrendingUp,
  BookOpen,
  DollarSign,
  Wifi,
  ClipboardList,
  CalendarDays,
  MapPin,
  Database,
} from "lucide-react";

const integrantes = [
  {
    icon: Building2,
    nombre: "Ente Tucumán Turismo",
    rol: "Coordinación general",
    descripcion:
      "Coordina el funcionamiento del Observatorio y aporta sus recursos humanos, tecnológicos y económicos.",
  },
  {
    icon: GraduationCap,
    nombre: "Universidad del Norte Santo Tomás de Aquino",
    rol: "Asistencia académica",
    descripcion:
      "Participa con estudiantes de la Licenciatura en Turismo que colaboran en los operativos de relevamiento.",
  },
  {
    icon: BarChart3,
    nombre: "Cámara de Turismo de Tucumán",
    rol: "Información sectorial",
    descripcion: "Facilita el acceso a la información del sector turístico privado.",
  },
  {
    icon: Landmark,
    nombre: "Dirección Provincial de Estadísticas",
    rol: "Datos y metodología",
    descripcion:
      "Provee los datos relevantes producidos en la provincia y aporta el diseño de muestra para operativos y la metodología aplicada al procesamiento de datos e índices estadísticos.",
  },
];

const funciones = [
  { icon: Hotel, text: "Relevamiento de la ocupación hotelera y parahotelera de Tucumán." },
  { icon: Plane, text: "Relevamiento mensual del movimiento de pasajeros en el aeropuerto, la terminal de ómnibus y peajes." },
  { icon: FileText, text: "Generación de 11 informes mensuales de coyuntura turística." },
  { icon: TrendingUp, text: "Estudio de la evolución de la oferta de alojamiento en la provincia." },
  { icon: BookOpen, text: "Generación de un anuario estadístico." },
  { icon: DollarSign, text: "Análisis de tarifas a nivel provincial." },
  { icon: Wifi, text: "Análisis de la conectividad aérea y terrestre de Tucumán." },
  { icon: ClipboardList, text: "Relevamiento estadístico pre-temporada." },
  { icon: CalendarDays, text: "Operativos de relevamiento estadístico y sus respectivos balances de temporadas (verano, semana santa e invierno)." },
  { icon: MapPin, text: "Informes de fines de semana largos." },
  { icon: Database, text: "Aportes de datos estadísticos para inversores e interesados." },
];

export default function QuienesSomosPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative text-white py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/quienesomos.jpg')" }}
      >
          <div className="relative container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl font-bold rounded-md bg-brand w-fit px-4 py-1">Observatorio Turístico de Tucumán</h1>
          <p className="text-lg text-white text-center bg-[#EA7220] px-4 py-1 mt-1 w-fit rounded-md">
            Datos estadísticos confiables sobre el comportamiento y las tendencias del sector turístico.
          </p>
        </div>
      </section>

      {/* Presentación */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            En la actualidad, resulta de vital importancia el acceder a estadísticas confiables que
            ofrezcan a destinatarios tanto públicos como privados información sobre el comportamiento y
            las tendencias del sector turístico. Con este objetivo es que, en&nbsp;2016, el Ente Tucumán
            Turismo puso en marcha el Observatorio Turístico de Tucumán.
          </p>
        </div>
      </section>

      {/* Integrantes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">¿Quiénes lo integran?</h2>
          <p className="text-center text-muted-foreground text-[13px] mb-10 max-w-xl mx-auto">
            El Observatorio Turístico es un espacio de trabajo interinstitucional.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {integrantes.map((item) => (
              <ProfileCard key={item.nombre} title={item.nombre} subtitle={item.rol} accent="teal">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#006e66]/10">
                    <item.icon className="h-4 w-4 text-[#006e66]" />
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{item.descripcion}</p>
                </div>
              </ProfileCard>
            ))}
          </div>
        </div>
      </section>

      {/* Funciones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">¿Cuáles son sus funciones?</h2>
          <p className="text-center text-muted-foreground text-[13px] mb-10 max-w-xl mx-auto">
            El Observatorio Turístico realiza los siguientes estudios y operativos.
          </p>
          <div className="grid gap-4 md:grid-cols-3 mx-auto max-w-4xl">
            {funciones.map((f) => (
              <div
                key={f.text}
                className="flex items-start gap-3 rounded-[12px] bg-card p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#223468]/10">
                  <f.icon className="h-4 w-4 text-[#223468]" />
                </div>
                <p className="text-[13px] leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}