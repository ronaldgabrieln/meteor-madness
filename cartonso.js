import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir tus archivos HTML/CSS

// System prompt para Cartonso
const SYSTEM_PROMPT = `Eres Cartonso, un chatbot experto en meteoros creado para un proyecto del hackathon de la NASA. 

Tu nombre es Cartonso y tu especialidad es todo lo relacionado con:
- Meteoros, meteoritos y meteoroides
- Asteroides y cometas
- Impactos de objetos cercanos a la Tierra (NEOs)
- Historia de impactos meteoríticos
- Detección y seguimiento de meteoros
- Composición y clasificación de meteoritos
- Eventos de lluvia de meteoros

Siempre responde de manera educativa, entusiasta y accesible. Si te preguntan tu nombre, responde que eres Cartonso. Mantén tus respuestas concisas pero informativas.`;

// Endpoint principal para el chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // Construir el contexto de la conversación
        let fullPrompt = SYSTEM_PROMPT + "\n\n";
        
        // Agregar historial si existe
        if (history.length > 0) {
            history.forEach(msg => {
                fullPrompt += `${msg.role === 'user' ? 'Usuario' : 'Cartonso'}: ${msg.content}\n`;
            });
        }
        
        fullPrompt += `Usuario: ${message}\nCartonso:`;

        // Llamada a Ollama
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'phi3',
            prompt: fullPrompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9
            }
        });

        const aiResponse = response.data.response;

        res.json({
            success: true,
            message: aiResponse
        });

    } catch (error) {
        console.error('Error al comunicarse con Ollama:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error al procesar tu mensaje. Asegúrate de que Ollama esté corriendo.'
        });
    }
});

// Endpoint para verificar el estado
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Cartonso funcionando' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Cartonso corriendo en http://localhost:${PORT}`);
    console.log(`📡 Asegúrate de que Ollama esté corriendo con: ollama serve`);
});