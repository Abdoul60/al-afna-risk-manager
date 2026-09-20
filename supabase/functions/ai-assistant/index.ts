// ============================================================
// SUPABASE EDGE FUNCTION — "ai-assistant"
// Fait le pont entre la plateforme et l'API Google Gemini.
// La clé API reste ici, côté serveur, jamais visible du navigateur.
// ============================================================

Deno.serve(async (req) => {
  // Autoriser les appels depuis le navigateur (CORS)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { task, payload } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY non configurée sur le serveur." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let prompt = "";

    if (task === "suggest_menace") {
      // payload attendu : { nomActif, typeActif }
      prompt = `Tu es un expert en sécurité de l'information (ISO/IEC 27005).
Pour l'actif suivant : "${payload.nomActif}" (type : "${payload.typeActif}"),
propose UNE menace plausible et réaliste qui pourrait l'affecter.
Réponds UNIQUEMENT en JSON strict, sans texte autour, au format exact :
{"nom": "...", "description": "...", "source": "interne" | "externe" | "environnementale"}`;
    }

    else if (task === "suggest_mesure") {
      // payload attendu : { nomActif, nomMenace, nomVuln, niveau }
      prompt = `Tu es un expert en sécurité de l'information (ISO/IEC 27002).
Pour le risque suivant :
- Actif : "${payload.nomActif}"
- Menace : "${payload.nomMenace}"
- Vulnérabilité : "${payload.nomVuln || "non précisée"}"
- Niveau de risque : "${payload.niveau}"

Propose une réponse de traitement adaptée.
Réponds UNIQUEMENT en JSON strict, sans texte autour, au format exact :
{"option_meta": "Modifier" | "Éviter" | "Transférer" | "Accepter", "mesure_iso27002": "code + intitulé court, ex: A.8.20 - Sécurité des réseaux", "description_mesure": "1 phrase concrète"}`;
    }

    else if (task === "synthese_rapport") {
      // payload attendu : { nomOrganisation, nbActifs, nbRisques, risquesCritiques }
      prompt = `Tu rédiges la synthèse managériale d'un rapport d'audit de sécurité pour "${payload.nomOrganisation}".
Contexte : ${payload.nbActifs} actifs recensés, ${payload.nbRisques} risques identifiés, dont ${payload.risquesCritiques} jugés critiques ou élevés.
Rédige un paragraphe court (4 à 6 phrases), clair, destiné à une direction non technique.
Réponds UNIQUEMENT en JSON strict : {"synthese": "..."}`;
    }

    else {
      return new Response(JSON.stringify({ error: "Tâche IA inconnue." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(JSON.stringify({ error: "Réponse IA non exploitable.", raw: rawText }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});