const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const configJsPath = path.join(__dirname, 'config.js');
const imagesDir = path.join(__dirname, 'IMAGENES');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

try {
    // 1. Read config.json
    let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    let optimizedCount = 0;

    // Optimize sponsors
    if (config.sponsors && config.sponsors.length > 0) {
        config.sponsors = config.sponsors.map((sponsor, index) => {
            if (sponsor.startsWith('data:image/')) {
                console.log(`Encontrada imagen base64 de Sponsor en index ${index}.`);
                const match = sponsor.match(/data:(image\/\w+);base64,/);
                const mimeType = match ? match[1] : 'image/png';
                const extension = mimeType.split('/')[1] || 'png';
                const base64Data = sponsor.replace(/^data:image\/\w+;base64,/, "");
                const fileName = `sponsor_auto_${index}_${Date.now()}.${extension}`;
                const filePath = path.join(imagesDir, fileName);
                
                fs.writeFileSync(filePath, base64Data, 'base64');
                console.log(`Guardado: ./IMAGENES/${fileName}`);
                optimizedCount++;
                return `./IMAGENES/${fileName}`;
            }
            return sponsor;
        });
    }

    // Optimize logoImage if base64
    if (config.logoImage && config.logoImage.startsWith('data:image/')) {
        console.log('Encontrado logo en base64.');
        const match = config.logoImage.match(/data:(image\/\w+);base64,/);
        const mimeType = match ? match[1] : 'image/png';
        const extension = mimeType.split('/')[1] || 'png';
        const base64Data = config.logoImage.replace(/^data:image\/\w+;base64,/, "");
        const fileName = `logo_auto_${Date.now()}.${extension}`;
        const filePath = path.join(imagesDir, fileName);
        
        fs.writeFileSync(filePath, base64Data, 'base64');
        console.log(`Guardado: ./IMAGENES/${fileName}`);
        config.logoImage = `./IMAGENES/${fileName}`;
        optimizedCount++;
    }

    if (optimizedCount > 0) {
        // Save optimized config.json
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        console.log('config.json optimizado con éxito.');

        // Save optimized config.js
        const configJsContent = `const config = ${JSON.stringify(config, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = config;\n}`;
        fs.writeFileSync(configJsPath, configJsContent, 'utf8');
        console.log('config.js optimizado con éxito.');
    } else {
        console.log('No se encontraron imágenes en base64 para optimizar.');
    }

} catch (err) {
    console.error('Error al optimizar los archivos de configuración:', err);
}
