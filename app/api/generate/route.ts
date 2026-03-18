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
};

const STYLE_MAP: Record<string, string> = {
  photorealistic: "ultra-photorealistic, 8K quality, dramatic lighting, depth of field",
  oil_painting: "in the style of a classic oil painting, rich textures, impressionist brushwork",
  pencil_sketch: "detailed pencil sketch, fine lines, cross-hatching, technical illustration style",
  watercolor: "watercolor painting, soft washes, artistic, loose brushwork",
  vintage_poster: "vintage racing poster style, bold colors, retro typography feel, 1950s poster art",
};

function buildPrompt(car: { label: string; year: string }, angle: { id: string; label: string }, color: { label: string }, environment: { id: string; label: string }, style: { id: string }, customPrompt: string) {
  let prompt = `A stunning ${color.label.toLowerCase()} ${car.label} (${car.year}), ${ANGLE_MAP[angle.id] || angle.label}, ${ENV_MAP[environment.id] || environment.label}. ${STYLE_MAP[style.id] || "photorealistic"}. The car features authentic period-correct details: wire wheels, chrome bumpers, curved fenders, round headlights typical of 1940s-1950s sports cars. Classic vintage automobile photography.`;

  if (customPrompt) prompt += ` Additional details: ${customPrompt}`;
  return prompt;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { car, angle, color, environment, style, customPrompt, apiKey: clientApiKey } = body;

  const apiKey = clientApiKey || process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Clé API manquante. Entrez votre clé xAI dans les paramètres." }, { status: 401 });
  }

  const prompt = buildPrompt(car, angle, color, environment, style, customPrompt || "");

  const response = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-image",
      prompt,
      n: 1,
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: errorData.error?.message || `API error: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;

  if (!imageUrl) {
    return NextResponse.json({ error: "No image returned from API" }, { status: 500 });
  }

  return NextResponse.json({ imageUrl, prompt });
}
