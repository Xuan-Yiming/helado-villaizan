import { translate } from "@vitalets/google-translate-api";

// Configuración del cliente de Hugging Face
import { HfInference } from "@huggingface/inference";
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function isCriticalComment(text: string): Promise<boolean> {
    try {
        // Verificar si contiene signos de interrogación
        if (text.includes("?") || text.includes("¿")) {
            console.log(`El comentario contiene un signo de interrogación: "${text}"`);
            return true; // Devuelve true directamente
        }

        // Traducir el texto al inglés
        const translation = await translate(text, { to: "en" });
        const translatedText = translation.text;

        console.log(`Texto original: ${text}`);
        console.log(`Texto traducido: ${translatedText}`);

        // Clasificación de sentimientos con Hugging Face
        const result = await hf.textClassification({
            model: "cardiffnlp/twitter-roberta-base-sentiment-latest", // Modelo optimizado para inglés
            inputs: translatedText,
        });

        // El modelo devuelve etiquetas como "LABEL_0", "LABEL_1", "LABEL_2"
        // - LABEL_0: Negativo
        // - LABEL_1: Neutral
        // - LABEL_2: Positivo
        const label = result[0]?.label; // e.g., "LABEL_0"

        console.log(`Resultado del análisis: ${label}`);

        // Clasificamos como crítico si el comentario es negativo (LABEL_0) o neutral (LABEL_1)
        return label === "negative" || label === "neutral";
    } catch (error) {
        console.error("Error al analizar el comentario:", error);
        return false; // Si ocurre un error, asumimos que no es crítico
    }
}
