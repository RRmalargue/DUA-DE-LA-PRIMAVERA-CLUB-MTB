const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function determineCategory(age, gender, distance) {
    if (!config || !config.categories || config.categories.length === 0) {
        return 'General';
    }
    
    const genderLower = (gender || '').toLowerCase();
    const distClean = (distance || '').toLowerCase().replace(/\s+/g, ''); // "5kms" o "15kms"
    
    // Filtrar candidatos por edad
    const candidates = config.categories.filter(cat => age >= cat.minAge && age <= cat.maxAge);
    console.log('Age:', age);
    console.log('Gender:', gender);
    console.log('Distance:', distance);
    console.log('Candidates matching age:', candidates.map(c => c.name));
    
    if (candidates.length === 0) {
        return 'Sin categoría asignada (Fuera de rango)';
    }
    
    let bestCandidate = null;
    let highestScore = -999;
    
    candidates.forEach(cat => {
        const catId = cat.id.toLowerCase();
        const catName = cat.name.toLowerCase();
        let score = 0;
        
        // Evaluar género si la categoría contiene palabras clave de género
        const hasDamas = catId.includes('damas') || catId.includes('femenino') || catName.includes('damas') || catName.includes('femenino');
        const hasCaballeros = catId.includes('caballeros') || catId.includes('masculino') || catName.includes('caballeros') || catName.includes('masculino');
        
        if (hasDamas || hasCaballeros) {
            if (genderLower.includes('fem') || genderLower.includes('dam')) {
                if (hasDamas) score += 10;
                if (hasCaballeros) score -= 100;
            } else if (genderLower.includes('masc') || genderLower.includes('cab')) {
                if (hasCaballeros) score += 10;
                if (hasDamas) score -= 100;
            }
        }
        
        // Evaluar distancia si la categoría contiene palabras clave de distancia
        const has5k = catId.includes('5_km') || catId.includes('5k') || catName.includes('5 km') || catName.includes('5k');
        const has15k = catId.includes('15_km') || catId.includes('15k') || catName.includes('15 km') || catName.includes('15k');
        
        if (has5k || has15k) {
            if (distClean.includes('15')) {
                if (has15k) score += 5;
                if (has5k) score -= 100;
            } else if (distClean.includes('5')) {
                if (has5k) score += 5;
                if (has15k) score -= 100;
            }
        }
        
        console.log(`Candidate: ${cat.name} | Score: ${score}`);
        
        if (score > highestScore) {
            highestScore = score;
            bestCandidate = cat;
        }
    });
    
    if (bestCandidate && highestScore >= 0) {
        return bestCandidate.name;
    }
    
    return 'Sin categoría asignada';
}

console.log('Result:', determineCategory(60, "Masculino", ""));
