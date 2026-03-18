import { NextRequest, NextResponse } from "next/server";

const ANGLE_MAP: Record<string, string> = {
  front_34: "three-quarter front view",
  side: "side profile view",
  front: "straight front view",
  rear_34: "three-quarter rear view",
  rear: "straight rear view",
  top: "elevated three-quarter view",
};

const ENV_MAP: Record<string, string> = {
  studio: "in a dramatic studio with dark background and spotlights",
  mountain_road: "on a winding mountain road with Alps in the background",
  coastal_road: "on a coastal Mediterranean road with sea view",
  race_track: "on a vintage race track circuit",
  garage: "in an old vintage garage with cobblestone floor",
  countryside: "in a scenic French countryside landscape",
  city_street: "on a cobblestone city street with elegant 1950s buildings, Parisian boulevard atmosphere",
  tunnel: "emerging from a dramatic stone tunnel, headlights on, with light rays and atmospheric fog",
};

const OCCUPANTS_MAP: Record<string, string> = {
  none: "",
  driver: "with a stylish male driver wearing a leather racing helmet and goggles, period-correct racing attire",
  driver_passenger: "with a stylish male driver wearing a leather racing helmet and goggles and an elegant female passenger with a silk scarf and vintage sunglasses",
};

const STYLE_MAP: Record<string, string> = {
  photorealistic: "ultra-photorealistic, 8K quality, dramatic lighting, depth of field",
  oil_painting: "in the style of a classic oil painting, rich textures, impressionist brushwork",
  pencil_sketch: "detailed pencil sketch, fine lines, cross-hatching, technical illustration style",
  watercolor: "watercolor painting, soft washes, artistic, loose brushwork",
  vintage_poster: "vintage racing poster style, bold colors, retro typography feel, 1950s poster art",
};

function buildPrompt(car: { label: string; year: string }, angle: { id: string; label: string }, color: { label: string }, environment: { id: string; label: string }, style: { id: string }, occupants: { id: string }, customPrompt: string) {
  const occupantsText = OCCUPANTS_MAP[occupants?.id] || "";
  let prompt = `A stunning ${color.label.toLowerCase()} ${car.label} (${car.year}), ${ANGLE_MAP[angle.id] || angle.label}, ${ENV_MAP[environment.id] || environment.label}${occupantsText ? `, ${occupantsText}` : ""}. ${STYLE_MAP[style.id] || "photorealistic"}. The car features authentic period-correct details: wire wheels, chrome bumpers, curved fenders, round headlights typical of 1940s-1950s sports cars. Classic vintage automobile photography.`;

  if (customPrompt) prompt += ` Additional details: ${customPrompt}`;
  return prompt;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { car, angle, color, environment, style, occupants, customPrompt, apiKey: clientApiKey } = body;

  const apiKey = clientApiKey || process.env.HF_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Clé API manquante. Entrez votre clé Hugging Face (hf_...) dans les paramètres." }, { status: 401 });
  }

  const prompt = buildPrompt(car, angle, color, environment, style, occupants || { id: "none" }, customPrompt || "");

  const response = await fetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    return NextResponse.json(
      { error: `API error: ${response.status}${errorText ? " - " + errorText : ""}` },
      { status: response.status }
    );
  }

  const imageBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");
  const imageUrl = `data:image/jpeg;base64,${base64}`;

  return NextResponse.json({ imageUrl, prompt });
}
