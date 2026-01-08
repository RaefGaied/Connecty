import { generatePostIdeas, chatWithAI as chatWithAIService, analyzeSentiment as analyzeSentimentService } from "../services/aiService.js";

export const getPostIdeas = async (req, res, next) => {
    try {
        const { topic, tone = "professionnel", audience = "réseau social" } = req.body;

        const ideas = await generatePostIdeas({ topic, tone, audience });

        res.status(200).json({
            success: true,
            data: ideas,
        });
    } catch (error) {
        console.error("Gemini API error", error);
        next("Impossible de générer des idées pour le moment. Réessayez plus tard.");
    }
};

export const analyzeSentiment = async (req, res, next) => {
    try {
        const { text, context } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le texte est requis pour l'analyse de sentiment"
            });
        }

        const result = await analyzeSentimentService({
            text: text.trim(),
            context: context?.trim() || null
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Erreur dans le contrôleur analyzeSentiment:", error);
        next("Une erreur est survenue lors de l'analyse de sentiment. Veuillez réessayer.");
    }
};

export const chatWithAI = async (req, res, next) => {
    try {
        const { messages, chatId } = req.body;
        const userId = req.user._id; // Assuming user is authenticated and user ID is available in req.user

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le paramètre 'messages' est requis et doit être un tableau non vide"
            });
        }

        // Validate each message in the messages array
        const isValidMessages = messages.every(msg =>
            msg &&
            typeof msg.role === 'string' &&
            typeof msg.content === 'string' &&
            (msg.role === 'user' || msg.role === 'assistant')
        );

        if (!isValidMessages) {
            return res.status(400).json({
                success: false,
                message: "Chaque message doit avoir un rôle ('user' ou 'assistant') et un contenu"
            });
        }

        const result = await chatWithAIService({
            messages,
            userId,
            chatId
        });

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error || "Erreur lors de la génération de la réponse",
                details: result.details
            });
        }

        res.status(200).json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error("Erreur dans le contrôleur chatWithAI:", error);
        next("Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.");
    }
};
