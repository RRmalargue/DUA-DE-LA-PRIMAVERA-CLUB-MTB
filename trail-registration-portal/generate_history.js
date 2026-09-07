const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\b8ea5ccc-0d18-4d94-8847-f3e02d2fd435\\.system_generated\\logs\\transcript_full.jsonl';
const outputPath = path.join(__dirname, 'HISTORIAL_CONVERSACION.md');

async function processLog() {
    if (!fs.existsSync(logPath)) {
        console.error('No se pudo encontrar el archivo de transcripción en:', logPath);
        return;
    }

    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let markdownContent = `# Historial Completo de la Conversación\n\nEste documento contiene el registro completo de preguntas, respuestas, guías de usuario y decisiones técnicas de esta sesión de trabajo para el portal de la carrera **Cross Trail "Tercer Tiempo"**.\n\n---\n\n`;

    let lastUserMessage = '';

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const step = JSON.parse(line);
            
            if (step.type === 'USER_INPUT') {
                let text = step.content || '';
                // Limpiar etiquetas del prompt de usuario
                if (text.includes('<USER_REQUEST>')) {
                    const match = text.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
                    if (match) text = match[1];
                }
                text = text.trim();
                
                if (text && text !== lastUserMessage) {
                    markdownContent += `\n### 👤 Usuario:\n> ${text.replace(/\n/g, '\n> ')}\n\n`;
                    lastUserMessage = text;
                }
            } else if (step.source === 'MODEL' && step.type === 'PLANNER_RESPONSE' && step.content) {
                let text = step.content.trim();
                if (text) {
                    // Remover pensamientos o secciones técnicas si es que vinieran duplicadas
                    markdownContent += `### 🤖 Antigravity:\n\n${text}\n\n---\n\n`;
                }
            }
        } catch (e) {
            // Ignorar errores de parseo
        }
    }

    fs.writeFileSync(outputPath, markdownContent, 'utf8');
    console.log('Historial generado con éxito en:', outputPath);
}

processLog();
