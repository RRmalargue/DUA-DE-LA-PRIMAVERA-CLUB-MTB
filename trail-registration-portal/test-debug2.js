const FALLBACK_CONFIG = {
  "categories": [
    { "id": "infantiles_4_y_5_años", "name": "INFANTILES 4 Y 5 AÑOS 100 MTS", "minAge": 4, "maxAge": 5 },
    { "id": "infantiles_6_y_7_años", "name": "INFANTILES 6 Y 7 AÑOS 200 MTS", "minAge": 6, "maxAge": 7 },
    { "id": "infantiles_8_y_9_años", "name": "INFANTILES 8 Y 9 AÑOS 400 MTS", "minAge": 8, "maxAge": 9 },
    { "id": "infantiles_10_y_11_años", "name": "INFANTILES 10 Y 11 AÑOS 800 MTS", "minAge": 10, "maxAge": 11 },
    { "id": "infantiles_12_y_13_años", "name": "INFANTILES 12 Y 13 AÑOS 1200 MTS", "minAge": 12, "maxAge": 13 },
    { "id": "damas_5_kms", "name": "DAMAS 5 KMS LIBRE", "minAge": 13, "maxAge": 80 },
    { "id": "caballeros_5_kms_libre", "name": "CABALLEROS 5 KMS LIBRE", "minAge": 13, "maxAge": 80 },
    { "id": "damas_15_kms_16_a_19_años", "name": "DAMAS 15 KMS 16  A 19 AÑOS", "minAge": 16, "maxAge": 19 },
    { "id": "damas_15_kms_20_a_29_años", "name": "DAMAS 15 KMS 20 A 29 AÑOS", "minAge": 20, "maxAge": 29 },
    { "id": "damas_15_kms_30_a_39_años", "name": "DAMAS 15 KMS 30 A 39 AÑOS", "minAge": 30, "maxAge": 39 },
    { "id": "damas_15_kms_40_a_49_años", "name": "DAMAS 15 KMS 40 A 49 AÑOS", "minAge": 40, "maxAge": 49 },
    { "id": "damas_15_kms_50_a_59_años", "name": "DAMAS 15 KMS 50 A 59 AÑOS", "minAge": 50, "maxAge": 59 },
    { "id": "damas_15_kms_60_a_69_años", "name": "DAMAS 15 KMS 60 A 69 AÑOS", "minAge": 60, "maxAge": 69 },
    { "id": "15_kms_caballeros_16_a_19_años", "name": "15 KMS CABALLEROS 16 A 19 AÑOS", "minAge": 16, "maxAge": 19 },
    { "id": "15_kms_caballeros_20_a_29_años", "name": "15 KMS CABALLEROS 20 A 29 AÑOS", "minAge": 20, "maxAge": 29 },
    { "id": "15_kms_caballeros_30_a_39_años", "name": "15 KMS CABALLEROS 30 A 39 AÑOS", "minAge": 30, "maxAge": 39 },
    { "id": "15_kms_caballeros_40_a_49_años", "name": "15 KMS CABALLEROS 40 A 49 AÑOS", "minAge": 40, "maxAge": 49 },
    { "id": "15_kms_caballeros_50_a_59_años", "name": "15 KMS CABALLEROS 50 A 59 AÑOS", "minAge": 50, "maxAge": 59 },
    { "id": "15_kms_caballeros_60_a_69_años", "name": "15 KMS CABALLEROS 60 A 69 AÑOS", "minAge": 60, "maxAge": 69 }
  ]
};

function determineCategory(age, gender, distance) {
    const config = FALLBACK_CONFIG;
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
