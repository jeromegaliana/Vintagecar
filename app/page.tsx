"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CAR_MODELS = [
  { id: "porsche_356", label: "Porsche 356", year: "1948–1965" },
  { id: "ferrari_166", label: "Ferrari 166 MM", year: "1948–1953" },
  { id: "jaguar_xk120", label: "Jaguar XK120", year: "1948–1954" },
  { id: "alfa_1900", label: "Alfa Romeo 1900 Sprint", year: "1951–1958" },
  { id: "bmw_328", label: "BMW 328", year: "1936–1940" },
  { id: "maserati_a6", label: "Maserati A6 GCS", year: "1947–1953" },
  { id: "mercedes_300sl", label: "Mercedes-Benz 300 SL", year: "1954–1957" },
  { id: "aston_db2", label: "Aston Martin DB2", year: "1950–1953" },
  { id: "lancia_aurelia", label: "Lancia Aurelia B20 GT", year: "1951–1958" },
  { id: "bugatti_57", label: "Bugatti Type 57 Atlantic", year: "1934–1940" },
  { id: "cisitalia_202", label: "Cisitalia 202", year: "1947–1952" },
  { id: "delahaye_135", label: "Delahaye 135 MS", year: "1935–1954" },
  { id: "triumph_tr2", label: "Triumph TR2", year: "1953–1955" },
  { id: "ferrari_250", label: "Ferrari 250 GT", year: "1954–1964" },
  { id: "talbot_lago", label: "Talbot-Lago T26 GS", year: "1947–1955" },
  { id: "lotus_eleven", label: "Lotus Eleven", year: "1956–1958" },
];

const VIEW_ANGLES = [
  { id: "front_34", label: "3/4 Avant", icon: "↗" },
  { id: "side", label: "Profil", icon: "→" },
  { id: "front", label: "Face", icon: "↑" },
  { id: "rear_34", label: "3/4 Arrière", icon: "↙" },
  { id: "rear", label: "Arrière", icon: "↓" },
  { id: "top", label: "Vue Haute", icon: "⊙" },
];

const COLORS = [
  { id: "silver", label: "Argent", hex: "#C0C0C0" },
  { id: "red", label: "Rouge Racing", hex: "#CC0000" },
  { id: "british_green", label: "British Racing Green", hex: "#1A4A2E" },
  { id: "cream", label: "Crème", hex: "#F5F0DC" },
  { id: "midnight_blue", label: "Bleu Nuit", hex: "#1C2B5E" },
  { id: "black", label: "Noir", hex: "#1A1A1A" },
  { id: "yellow", label: "Jaune Soleil", hex: "#E8C830" },
  { id: "burgundy", label: "Bordeaux", hex: "#722F37" },
];

const ENVIRONMENTS = [
  { id: "studio", label: "Studio" },
  { id: "mountain_road", label: "Route de Montagne" },
  { id: "coastal_road", label: "Côte Méditerranée" },
  { id: "race_track", label: "Circuit de Course" },
  { id: "garage", label: "Garage Vintage" },
  { id: "countryside", label: "Campagne" },
  { id: "city_street", label: "Rue de Ville" },
  { id: "tunnel", label: "Tunnel" },
];

const OCCUPANTS = [
  { id: "none", label: "Aucun" },
  { id: "driver", label: "Conducteur" },
  { id: "driver_passenger", label: "Conducteur + Passagère" },
];

const STYLES = [
  { id: "photorealistic", label: "Photoréaliste" },
  { id: "oil_painting", label: "Peinture à l'Huile" },
  { id: "pencil_sketch", label: "Esquisse au Crayon" },
  { id: "watercolor", label: "Aquarelle" },
  { id: "vintage_poster", label: "Affiche Vintage" },
  { id: "james_bond", label: "James Bond" },
  { id: "the_saint", label: "Le Saint" },
];

export default function Home() {
  const [selectedCar, setSelectedCar] = useState(CAR_MODELS[0]);
  const [selectedAngle, setSelectedAngle] = useState(VIEW_ANGLES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedEnv, setSelectedEnv] = useState(ENVIRONMENTS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedOccupants, setSelectedOccupants] = useState(OCCUPANTS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hf_api_key");
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = () => {
    localStorage.setItem("hf_api_key", apiKey);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car: selectedCar,
          angle: selectedAngle,
          color: selectedColor,
          environment: selectedEnv,
          style: selectedStyle,
          occupants: selectedOccupants,
          customPrompt,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur de génération");

      setGeneratedImages((prev) => [data.imageUrl, ...prev].slice(0, 6));
      setActiveImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #1a1008 0%, #2a1a08 50%, #1a0808 100%)" }}>
      {/* Header */}
      <header className="border-b border-amber-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-widest" style={{ color: "#d4a843", fontFamily: "Georgia, serif" }}>
              VINTAGE CAR GENERATOR
            </h1>
            <p className="text-sm tracking-widest mt-1" style={{ color: "#8a6a30" }}>
              AUTOMOBILES DE SPORT DES ANNÉES 40–50
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded px-3 py-2" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,168,67,0.2)" }}>
              <span className="text-xs tracking-widest whitespace-nowrap" style={{ color: "#6a4a20" }}>CLÉ API HF</span>
              <div className="flex items-center gap-1">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveApiKey()}
                  placeholder="hf_..."
                  className="text-sm outline-none w-48"
                  style={{ background: "transparent", color: "#d4a843", caretColor: "#d4a843" }}
                />
                <button
                  onClick={() => setShowApiKey((v) => !v)}
                  className="text-xs px-1 transition-colors"
                  style={{ color: "#6a4a20" }}
                  title={showApiKey ? "Masquer" : "Afficher"}
                >
                  {showApiKey ? "🙈" : "👁"}
                </button>
                <button
                  onClick={saveApiKey}
                  className="text-xs px-2 py-1 rounded transition-all"
                  style={{
                    background: apiKeySaved ? "rgba(80,160,80,0.2)" : "rgba(212,168,67,0.15)",
                    border: apiKeySaved ? "1px solid rgba(80,160,80,0.4)" : "1px solid rgba(212,168,67,0.3)",
                    color: apiKeySaved ? "#80c080" : "#d4a843",
                  }}
                >
                  {apiKeySaved ? "✓" : "Enregistrer"}
                </button>
              </div>
            </div>
            <div className="text-right text-xs" style={{ color: "#6a4a20" }}>
              <div>Propulsé par</div>
              <div className="text-amber-500 font-bold">Hugging Face</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Car Model */}
          <section>
            <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
              MODÈLE DE VOITURE
            </h2>
            <div className="space-y-2">
              {CAR_MODELS.map((car) => (
                <button
                  key={car.id}
                  onClick={() => setSelectedCar(car)}
                  className="w-full text-left px-4 py-3 rounded transition-all duration-200"
                  style={{
                    background: selectedCar.id === car.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                    border: selectedCar.id === car.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    color: selectedCar.id === car.id ? "#d4a843" : "#a08060",
                  }}
                >
                  <div className="font-semibold text-sm">{car.label}</div>
                  <div className="text-xs opacity-60">{car.year}</div>
                </button>
              ))}
            </div>
          </section>

          {/* View Angle */}
          <section>
            <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
              ANGLE DE VUE
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {VIEW_ANGLES.map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => setSelectedAngle(angle)}
                  className="py-3 px-2 rounded text-center transition-all duration-200"
                  style={{
                    background: selectedAngle.id === angle.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                    border: selectedAngle.id === angle.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    color: selectedAngle.id === angle.id ? "#d4a843" : "#a08060",
                  }}
                >
                  <div className="text-xl">{angle.icon}</div>
                  <div className="text-xs mt-1">{angle.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Color */}
          <section>
            <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
              COULEUR
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className="flex flex-col items-center gap-1 p-2 rounded transition-all duration-200"
                  style={{
                    border: selectedColor.id === color.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid transparent",
                    background: selectedColor.id === color.id ? "rgba(212,168,67,0.1)" : "transparent",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{
                      background: color.hex,
                      borderColor: selectedColor.id === color.id ? "#d4a843" : "rgba(255,255,255,0.2)",
                      boxShadow: selectedColor.id === color.id ? "0 0 8px rgba(212,168,67,0.4)" : "none",
                    }}
                  />
                  <span className="text-xs text-center leading-tight" style={{ color: selectedColor.id === color.id ? "#d4a843" : "#806040" }}>
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
          {/* Occupants */}
          <section>
            <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
              OCCUPANTS
            </h2>
            <div className="space-y-2">
              {OCCUPANTS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccupants(occ)}
                  className="w-full text-left px-4 py-3 rounded transition-all duration-200"
                  style={{
                    background: selectedOccupants.id === occ.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                    border: selectedOccupants.id === occ.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    color: selectedOccupants.id === occ.id ? "#d4a843" : "#a08060",
                  }}
                >
                  <div className="font-semibold text-sm">{occ.label}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Display */}
          <div
            className="relative rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(212,168,67,0.2)",
              minHeight: "400px",
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-amber-900 border-t-amber-500 animate-spin" />
                <p className="text-amber-600 text-sm tracking-widest">GÉNÉRATION EN COURS...</p>
              </div>
            ) : activeImage ? (
              <Image
                src={activeImage}
                alt="Generated vintage car"
                width={800}
                height={500}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <div className="text-center p-12">
                <div className="text-7xl mb-4 opacity-20">🏎</div>
                <p className="text-amber-800 tracking-widest text-sm">
                  CONFIGUREZ ET GÉNÉREZ VOTRE VOITURE VINTAGE
                </p>
              </div>
            )}
          </div>

          {/* Generated images thumbnails */}
          {generatedImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {generatedImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className="flex-shrink-0 w-24 h-16 rounded overflow-hidden transition-all duration-200"
                  style={{
                    border: activeImage === img ? "2px solid #d4a843" : "2px solid rgba(212,168,67,0.2)",
                  }}
                >
                  <Image src={img} alt={`Generated ${i}`} width={96} height={64} className="w-full h-full object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Environment & Style */}
          <div className="grid grid-cols-2 gap-6">
            <section>
              <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
                ENVIRONNEMENT
              </h2>
              <div className="space-y-2">
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnv(env)}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-all duration-200"
                    style={{
                      background: selectedEnv.id === env.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedEnv.id === env.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.06)",
                      color: selectedEnv.id === env.id ? "#d4a843" : "#a08060",
                    }}
                  >
                    {env.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
                STYLE ARTISTIQUE
              </h2>
              <div className="space-y-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-all duration-200"
                    style={{
                      background: selectedStyle.id === style.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedStyle.id === style.id ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.06)",
                      color: selectedStyle.id === style.id ? "#d4a843" : "#a08060",
                    }}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Custom prompt */}
          <section>
            <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: "#d4a843" }}>
              DÉTAILS SUPPLÉMENTAIRES (OPTIONNEL)
            </h2>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ex: avec des roues à rayons chromés, phares ronds, capot ouvert..."
              rows={3}
              className="w-full px-4 py-3 rounded text-sm resize-none outline-none transition-all"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(212,168,67,0.2)",
                color: "#d4a843",
                caretColor: "#d4a843",
              }}
            />
          </section>

          {/* API key warning */}
          {!apiKey && (
            <div className="px-4 py-3 rounded text-sm flex items-center gap-2" style={{ background: "rgba(180,120,0,0.1)", border: "1px solid rgba(180,120,0,0.3)", color: "#c09040" }}>
              <span>⚠️</span>
              <span>Entrez votre clé Hugging Face (hf_...) dans le champ en haut à droite pour générer des images.</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded text-sm" style={{ background: "rgba(200,50,50,0.15)", border: "1px solid rgba(200,50,50,0.4)", color: "#e87070" }}>
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 rounded text-base font-bold tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? "rgba(100,70,0,0.3)" : "linear-gradient(135deg, #8a5a00, #d4a843, #8a5a00)",
              color: isLoading ? "#8a6030" : "#1a0a00",
              border: "1px solid rgba(212,168,67,0.4)",
              boxShadow: isLoading ? "none" : "0 4px 20px rgba(212,168,67,0.2)",
            }}
          >
            {isLoading ? "GÉNÉRATION EN COURS..." : "GÉNÉRER LA VOITURE"}
          </button>

          {/* Prompt preview */}
          <details className="text-xs" style={{ color: "#4a3010" }}>
            <summary className="cursor-pointer tracking-widest hover:text-amber-700 transition-colors">
              VOIR LE PROMPT GÉNÉRÉ
            </summary>
            <div className="mt-2 p-3 rounded font-mono" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {buildPrompt({ car: selectedCar, angle: selectedAngle, color: selectedColor, environment: selectedEnv, style: selectedStyle, occupants: selectedOccupants, customPrompt })}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function buildPrompt({ car, angle, color, environment, style, occupants, customPrompt }: {
  car: typeof CAR_MODELS[0];
  angle: typeof VIEW_ANGLES[0];
  color: typeof COLORS[0];
  environment: typeof ENVIRONMENTS[0];
  style: typeof STYLES[0];
  occupants: typeof OCCUPANTS[0];
  customPrompt: string;
}) {
  const angleMap: Record<string, string> = {
    front_34: "three-quarter front view",
    side: "side profile view",
    front: "straight front view",
    rear_34: "three-quarter rear view",
    rear: "straight rear view",
    top: "elevated three-quarter view",
  };
  const envMap: Record<string, string> = {
    studio: "in a dramatic studio with dark background and spotlights",
    mountain_road: "on a winding mountain road with Alps in the background",
    coastal_road: "on a coastal Mediterranean road with sea view",
    race_track: "on a vintage race track circuit",
    garage: "in an old vintage garage with cobblestone floor",
    countryside: "in a scenic French countryside landscape",
    city_street: "on a cobblestone city street with elegant 1950s buildings, Parisian boulevard atmosphere",
    tunnel: "emerging from a dramatic stone tunnel, headlights on, with light rays and atmospheric fog",
  };
  const occupantsMap: Record<string, string> = {
    none: "",
    driver: "with a stylish male driver wearing a leather racing helmet and goggles, period-correct racing attire",
    driver_passenger: "with a stylish male driver wearing a leather racing helmet and goggles and an elegant female passenger with a silk scarf and vintage sunglasses",
  };
  const styleMap: Record<string, string> = {
    photorealistic: "ultra-photorealistic, 8K quality, dramatic lighting, depth of field",
    oil_painting: "in the style of a classic oil painting, rich textures, impressionist brushwork",
    pencil_sketch: "detailed pencil sketch, fine lines, cross-hatching, technical illustration style",
    watercolor: "watercolor painting, soft washes, artistic, loose brushwork",
    vintage_poster: "vintage racing poster style, bold colors, retro typography feel, 1950s poster art",
    james_bond: "cinematic spy thriller style, dramatic shadows, sleek and glamorous, high-contrast lighting reminiscent of 1960s James Bond films, secret agent atmosphere, Monte Carlo or Aston Martin vibes",
    the_saint: "stylish 1960s British TV series aesthetic, elegant and witty, Roger Moore as Simon Templar style, cream-colored Volvo P1800 era, suave gentleman adventurer mood, clean cinematic framing",
  };

  const occupantsText = occupantsMap[occupants.id];
  let prompt = `A stunning ${color.label.toLowerCase()} ${car.label} (${car.year}), ${angleMap[angle.id] || angle.label}, ${envMap[environment.id] || environment.label}${occupantsText ? `, ${occupantsText}` : ""}. ${styleMap[style.id] || style.label}. The car features authentic period-correct details: wire wheels, chrome bumpers, curved fenders, round headlights typical of 1940s-1950s sports cars. Classic vintage automobile photography.`;

  if (customPrompt) prompt += ` Additional details: ${customPrompt}`;

  return prompt;
}
