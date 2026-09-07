document.addEventListener('DOMContentLoaded', () => {
    // Current Active State
    const state = {
        raceName: '',
        googleScriptUrl: '',
        raceDescription: '',
        logoImage: '',
        contactWhatsapp: '',
        posterImage: '',
        tshirtImage: '',
        altitudeMapImage: '',
        kitImage: '',
        gpxLink: '',
        kmlLink: '',
        stravaLink: '',
        garminLink: '',
        googleEarthLink: '',
        startLocationMapLink: '',
        deslindeLink: '',
        clasificacionesLink: '',
        paymentDetails: '',
        distances: [],
        categories: [],
        sponsors: [],
        themeColors: {
            primary: '#ff6b35',
            primaryGlow: 'rgba(255, 107, 53, 0.35)',
            primaryDim: 'rgba(255, 107, 53, 0.1)',
            secondary: '#00f2fe',
            secondaryGlow: 'rgba(0, 242, 254, 0.35)'
        },
        themeBackground: 'default',
        borderRadiusStyle: '10px',
        formFields: []
    };

    // Rastreador de archivos modificados para subir a GitHub
    const modifiedFiles = new Set();
    const uploadedMediaFiles = new Set();
    let isInitialLoad = true;

    function updateGitHubUploadGuide() {
        const filesListEl = document.getElementById('github-files-list');
        const badgeEl = document.getElementById('github-files-status-badge');
        if (!filesListEl || !badgeEl) return;

        filesListEl.innerHTML = '';
        
        const allFiles = [];
        
        // Si hay cambios en los inputs o se guardó config
        if (modifiedFiles.has('config')) {
            allFiles.push({ name: 'config.js', desc: 'Configuración principal para la web pública' });
            allFiles.push({ name: 'config.json', desc: 'Configuración principal para este panel local' });
            allFiles.push({ name: 'sw.js', desc: 'Controlador de caché (para que se actualicen los celulares)' });
        }

        // Si se subieron archivos multimedia
        uploadedMediaFiles.forEach(fileName => {
            allFiles.push({ name: `IMAGENES/${fileName}`, desc: 'Archivo multimedia subido (foto/GPX/PDF/KML)' });
        });

        if (allFiles.length === 0) {
            badgeEl.textContent = 'Sin cambios detectados';
            badgeEl.style.background = 'rgba(255,255,255,0.1)';
            badgeEl.style.color = 'var(--text-muted)';
            badgeEl.style.border = 'none';
            filesListEl.innerHTML = `<li style="color: var(--text-muted); font-style: italic;"><i class="fa-solid fa-circle-info"></i> No has realizado modificaciones ni guardado cambios aún.</li>`;
        } else {
            badgeEl.textContent = `${allFiles.length} archivo(s) por subir`;
            badgeEl.style.background = 'var(--accent-orange)';
            badgeEl.style.color = '#000';
            badgeEl.style.fontWeight = 'bold';
            
            allFiles.forEach(file => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.gap = '0.5rem';
                li.style.padding = '0.4rem 0.6rem';
                li.style.background = 'rgba(255,255,255,0.03)';
                li.style.border = '1px solid rgba(255,255,255,0.05)';
                li.style.borderRadius = 'var(--radius-sm)';
                
                const icon = file.name.endsWith('.gpx') || file.name.endsWith('.kml') 
                    ? '<i class="fa-solid fa-route" style="color: var(--accent-orange);"></i>'
                    : file.name.endsWith('.pdf')
                    ? '<i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i>'
                    : '<i class="fa-solid fa-file-image" style="color: var(--accent-cyan);"></i>';
                
                li.innerHTML = `
                    ${icon}
                    <strong style="color: #fff; font-family: monospace; font-size: 0.95rem;">${file.name}</strong>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">— ${file.desc}</span>
                `;
                filesListEl.appendChild(li);
            });
        }
    }

    // DOM Elements - General Info
    const inputRaceName = document.getElementById('raceName');
    const inputGoogleScriptUrl = document.getElementById('googleScriptUrl');
    const inputRaceDescription = document.getElementById('raceDescription');
    const inputLogoImage = document.getElementById('logoImage');
    const inputLogoImageFile = document.getElementById('logoImageFile');
    const inputContactWhatsapp = document.getElementById('contactWhatsapp');
    const inputDeslindeLink = document.getElementById('deslindeLink');
    const inputClasificacionesLink = document.getElementById('clasificacionesLink');
    const inputPosterImage = document.getElementById('posterImage');
    const inputTshirtImage = document.getElementById('tshirtImage');
    const inputAltitudeMapImage = document.getElementById('altitudeMapImage');
    const inputKitImage = document.getElementById('kitImage');
    const inputKitImageFile = document.getElementById('kitImageFile');

    // DOM Elements - Maps
    const inputGpxLink = document.getElementById('gpxLink');
    const inputKmlLink = document.getElementById('kmlLink');
    const inputStravaLink = document.getElementById('stravaLink');
    const inputGarminLink = document.getElementById('garminLink');
    const inputGoogleEarthLink = document.getElementById('googleEarthLink');
    const inputStartLocationMapLink = document.getElementById('startLocationMapLink');
    const inputStartLatitude = document.getElementById('startLatitude');
    const inputStartLongitude = document.getElementById('startLongitude');

    // DOM Elements - Payments
    const inputPaymentDetails = document.getElementById('paymentDetails');

    // DOM Elements - Form Fields Section
    const fieldsDefaultTbody = document.getElementById('fields-default-tbody');
    const fieldsCustomTbody = document.getElementById('fields-custom-tbody');
    const inputNewFieldLabel = document.getElementById('new-field-label');
    const inputNewFieldRequired = document.getElementById('new-field-required');
    const btnAddCustomField = document.getElementById('btn-add-custom-field');

    // DOM Elements - Sponsors
    const inputNewSponsorLogo = document.getElementById('new-sponsor-logo');
    const btnAddSponsor = document.getElementById('btn-add-sponsor');
    const sponsorsListBody = document.getElementById('sponsors-list-body');
    const sponsorFileInput = document.getElementById('sponsor-file-input');

    // DOM Elements - Distances
    const distancesList = document.getElementById('distances-list');
    const inputNewDistId = document.getElementById('new-dist-id');
    const inputNewDistName = document.getElementById('new-dist-name');
    const inputNewDistPrice = document.getElementById('new-dist-price');
    const inputNewDistDetail = document.getElementById('new-dist-detail');
    const inputNewDistGpx = document.getElementById('new-dist-gpx');
    const inputNewDistStrava = document.getElementById('new-dist-strava');
    const inputNewDistGarmin = document.getElementById('new-dist-garmin');
    const inputNewDistGoogleEarth = document.getElementById('new-dist-google-earth');
    const inputNewDistAltitude = document.getElementById('new-dist-altitude');
    const inputNewDistAutoCategory = document.getElementById('new-dist-auto-category');
    const btnAddDistance = document.getElementById('btn-add-distance');
    const btnCancelEditDistance = document.getElementById('btn-cancel-edit-distance');

    let editingDistanceIndex = null;

    // Leaflet variables for Admin Map
    let adminMap = null;
    let startMarker = null;
    let cityMarker = null;
    let routePolyline = null;

    // DOM Elements - Categories
    const categoriesList = document.getElementById('categories-list');
    const selectCatDistance = document.getElementById('select-cat-distance');
    const inputNewCatId = document.getElementById('new-cat-id');
    const inputNewCatName = document.getElementById('new-cat-name');
    const inputNewCatMin = document.getElementById('new-cat-min');
    const inputNewCatMax = document.getElementById('new-cat-max');
    const inputNewCatRequiresPayment = document.getElementById('new-cat-requires-payment');
    const btnAddCategory = document.getElementById('btn-add-category');
    const btnLoadDefaultCategories = document.getElementById('btn-load-default-categories');
    const btnCancelCatEdit = document.getElementById('btn-cancel-cat-edit');
    let editingCategoryIndex = null;

    // DOM Elements - Output
    const btnSaveDisk = document.getElementById('btn-save-disk');
    const btnDownloadConfig = document.getElementById('btn-download-config');
    const btnCopyJson = document.getElementById('btn-copy-json');
    const jsonPreview = document.getElementById('json-preview');

    // 1. CARGA INICIAL
    async function loadConfig() {
        if (typeof window.RACE_CONFIG !== 'undefined' && window.RACE_CONFIG) {
            console.log('Cargada configuración dinámica local desde config.js');
            const data = window.RACE_CONFIG;
            Object.keys(state).forEach(key => {
                if (data[key] !== undefined) {
                    state[key] = data[key];
                }
            });
            migrateGlobalCategoriesToDistances();
            populateFormFields();
            renderDistances();
            updateCategoriesDistanceSelector();
            renderSponsors();
            updateJsonPreview();
        } else {
            try {
                const response = await fetch('./config.json');
                const data = await response.json();
                Object.keys(state).forEach(key => {
                    if (data[key] !== undefined) {
                        state[key] = data[key];
                    }
                });
                migrateGlobalCategoriesToDistances();
                populateFormFields();
                renderDistances();
                updateCategoriesDistanceSelector();
                renderSponsors();
                updateJsonPreview();
            } catch (error) {
                console.warn('No se detectó config.js ni se pudo cargar config.json. Cargando valores predeterminados.', error);
                loadStandardDefaults();
            }
        }
        
        isInitialLoad = false;
        
        // Inicializar el mapa de administración al final
        initAdminMap();
    }

    // Migrar las categorías del modelo antiguo al nuevo modelo por distancias
    function migrateGlobalCategoriesToDistances() {
        if (state.distances && state.distances.length > 0) {
            state.distances.forEach(dist => {
                if (!dist.categories) {
                    dist.categories = [];
                }
            });

            if (state.categories && state.categories.length > 0) {
                state.categories.forEach(cat => {
                    const catId = cat.id.toLowerCase();
                    
                    state.distances.forEach(dist => {
                        const distId = dist.id.toLowerCase();
                        let isMatch = false;
                        
                        if (distId.includes('15') && (catId.includes('15') || catId.includes('master') || catId.includes('juvenil') || catId.includes('prejuvenil'))) {
                            isMatch = true;
                        } else if (distId.includes('5') && !distId.includes('15') && (catId.includes('5') || catId.includes('libre'))) {
                            isMatch = true;
                        } else if (distId.includes('infant') && catId.includes('infant')) {
                            isMatch = true;
                        } else if (!distId.includes('15') && !distId.includes('5') && !distId.includes('infant')) {
                            isMatch = true;
                        }

                        if (isMatch) {
                            if (!dist.categories.some(c => c.id === cat.id)) {
                                dist.categories.push({ ...cat });
                            }
                        }
                    });
                });
            }
        }
    }

    function populateFormFields() {
        inputRaceName.value = state.raceName || '';
        inputGoogleScriptUrl.value = state.googleScriptUrl || '';
        inputRaceDescription.value = state.raceDescription || '';
        inputLogoImage.value = state.logoImage || '';
        inputContactWhatsapp.value = state.contactWhatsapp || '';
        inputDeslindeLink.value = state.deslindeLink || '';
        inputClasificacionesLink.value = state.clasificacionesLink || '';
        inputPosterImage.value = state.posterImage || '';
        inputTshirtImage.value = state.tshirtImage || '';
        inputAltitudeMapImage.value = state.altitudeMapImage || '';
        inputKitImage.value = state.kitImage || '';
        inputGpxLink.value = state.gpxLink || '';
        inputKmlLink.value = state.kmlLink || '';
        inputStravaLink.value = state.stravaLink || '';
        inputGarminLink.value = state.garminLink || '';
        inputGoogleEarthLink.value = state.googleEarthLink || '';
        inputStartLocationMapLink.value = state.startLocationMapLink || '';
        if (state.startLocationMapLink) {
            const coords = parseCoordsFromUrl(state.startLocationMapLink);
            if (coords) {
                if (inputStartLatitude) inputStartLatitude.value = coords[0].toFixed(6);
                if (inputStartLongitude) inputStartLongitude.value = coords[1].toFixed(6);
            } else {
                if (inputStartLatitude) inputStartLatitude.value = '';
                if (inputStartLongitude) inputStartLongitude.value = '';
            }
        } else {
            if (inputStartLatitude) inputStartLatitude.value = '';
            if (inputStartLongitude) inputStartLongitude.value = '';
        }
        inputPaymentDetails.value = state.paymentDetails || '';

        // Sincronizar botón Ver de Google Maps de Largada
        const viewBtn = document.getElementById('btn-open-start-google-maps');
        if (viewBtn) {
            viewBtn.href = state.startLocationMapLink || '#';
        }

        // Inicializar y renderizar campos del formulario
        if (!state.formFields || state.formFields.length === 0) {
            state.formFields = [
                { id: "nombre", label: "Nombre y Apellido", required: true, enabled: true, isDefault: true },
                { id: "cuil", label: "CUIL", required: true, enabled: true, isDefault: true },
                { id: "fecha_nacimiento", label: "Fecha de Nacimiento", required: true, enabled: true, isDefault: true },
                { id: "genero", label: "Género", required: true, enabled: true, isDefault: true },
                { id: "telefono", label: "Teléfono", required: true, enabled: true, isDefault: true },
                { id: "talle_remera", label: "Talle de Remera", required: true, enabled: true, isDefault: true },
                { id: "team_origen", label: "Team o Lugar de Origen", required: false, enabled: true, isDefault: true }
            ];
        } else {
            // Migrar si existía apellido por separado
            const nomField = state.formFields.find(f => f.id === 'nombre');
            if (nomField && nomField.label === 'Nombre') {
                nomField.label = 'Nombre y Apellido';
            }
            state.formFields = state.formFields.filter(f => f.id !== 'apellido');
        }
        renderFormFieldsEditor();

        // Sincronizar tema de color activo
        highlightActiveThemeButton();
    }

    function renderFormFieldsEditor() {
        if (!fieldsDefaultTbody || !fieldsCustomTbody) return;

        fieldsDefaultTbody.innerHTML = '';
        fieldsCustomTbody.innerHTML = '';

        (state.formFields || []).forEach((field, index) => {
            if (field.isDefault) {
                const tr = document.createElement('tr');
                
                const tdName = document.createElement('td');
                tdName.innerHTML = `<strong>${field.label}</strong> <span style="font-size: 0.8rem; color: var(--text-muted);">(ID: ${field.id})</span>`;
                tr.appendChild(tdName);

                const tdEnabled = document.createElement('td');
                tdEnabled.style.textAlign = 'center';
                const isCritical = ['nombre', 'apellido', 'fecha_nacimiento', 'genero'].includes(field.id);
                tdEnabled.innerHTML = `<input type="checkbox" data-index="${index}" class="field-enable-check" ${field.enabled ? 'checked' : ''} ${isCritical ? 'disabled' : ''}>`;
                tr.appendChild(tdEnabled);

                const tdRequired = document.createElement('td');
                tdRequired.style.textAlign = 'center';
                tdRequired.innerHTML = `<input type="checkbox" data-index="${index}" class="field-require-check" ${field.required ? 'checked' : ''} ${isCritical ? 'disabled' : ''}>`;
                tr.appendChild(tdRequired);

                const tdType = document.createElement('td');
                let typeText = 'Texto';
                if (field.id === 'fecha_nacimiento') typeText = 'Fecha (Especial)';
                if (field.id === 'genero' || field.id === 'talle_remera') typeText = 'Selección (Menú)';
                tdType.textContent = typeText;
                tr.appendChild(tdType);

                fieldsDefaultTbody.appendChild(tr);
            } else {
                const tr = document.createElement('tr');

                const tdName = document.createElement('td');
                tdName.innerHTML = `<strong>${field.label}</strong> <span style="font-size: 0.8rem; color: var(--text-muted);">(ID: ${field.id})</span>`;
                tr.appendChild(tdName);

                const tdRequired = document.createElement('td');
                tdRequired.style.textAlign = 'center';
                tdRequired.innerHTML = `<input type="checkbox" data-index="${index}" class="field-require-check" ${field.required ? 'checked' : ''}>`;
                tr.appendChild(tdRequired);

                const tdAction = document.createElement('td');
                tdAction.style.textAlign = 'center';
                tdAction.innerHTML = `<button type="button" class="btn-danger btn-delete-custom-field" data-index="${index}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; background: #ff3b30; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash-can"></i> Borrar</button>`;
                tr.appendChild(tdAction);

                fieldsCustomTbody.appendChild(tr);
            }
        });

        // Add event listeners
        document.querySelectorAll('.field-enable-check').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                state.formFields[index].enabled = e.target.checked;
                if (!e.target.checked) {
                    state.formFields[index].required = false;
                    const reqChk = document.querySelector(`.field-require-check[data-index="${index}"]`);
                    if (reqChk) reqChk.checked = false;
                }
                updateJsonPreview();
            });
        });

        document.querySelectorAll('.field-require-check').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                state.formFields[index].required = e.target.checked;
                if (e.target.checked) {
                    state.formFields[index].enabled = true;
                    const enChk = document.querySelector(`.field-enable-check[data-index="${index}"]`);
                    if (enChk) enChk.checked = true;
                }
                updateJsonPreview();
            });
        });

        document.querySelectorAll('.btn-delete-custom-field').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                state.formFields.splice(index, 1);
                renderFormFieldsEditor();
                updateJsonPreview();
            });
        });
    }

    // Event listener for adding custom field
    if (btnAddCustomField) {
        btnAddCustomField.addEventListener('click', () => {
            const labelVal = inputNewFieldLabel.value.trim();
            if (!labelVal) {
                alert('Por favor, ingresa el nombre del nuevo campo.');
                return;
            }

            const idVal = 'custom_' + labelVal
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-_]/g, '')
                .trim()
                .replace(/\s+/g, '_');

            const exists = state.formFields.some(f => f.id === idVal);
            if (exists) {
                alert('Ya existe un campo con este nombre o ID.');
                return;
            }

            const requiredVal = inputNewFieldRequired.checked;

            state.formFields.push({
                id: idVal,
                label: labelVal,
                required: requiredVal,
                enabled: true,
                isDefault: false
            });

            inputNewFieldLabel.value = '';
            inputNewFieldRequired.checked = true;

            renderFormFieldsEditor();
            updateJsonPreview();
        });
    }

    function loadStandardDefaults() {
        state.raceName = 'CROSS TRAIL "TERCER TIEMPO"';
        state.raceDescription = '¡Prepárate para una aventura inolvidable en la naturaleza! El Cross Trail "Tercer Tiempo" te llevará por senderos únicos, cruces de ríos, subidas técnicas y paisajes increíbles. Contamos con distancias para todos los niveles y categorías por edades. Asegura tu lugar hoy mismo.';
        state.posterImage = './IMAGENES/AFICHE TERCER.jpg';
        state.tshirtImage = './IMAGENES/REMERA TERCER.jpg';
        state.altitudeMapImage = './IMAGENES/MAPA ALTURA.jpg';
        state.deslindeLink = './assets/deslinde.pdf';
        state.gpxLink = '#';
        state.kmlLink = '#';
        state.startLocationMapLink = 'https://maps.google.com/?q=-34.603722,-58.381592';
        state.paymentDetails = "Banco de la Nación Argentina\nCBU: 0110599520000001234567\nAlias: ALPACHIRI.TRAIL\nTitular: Trail Running S.A.";
        
        state.themeColors = {
            primary: '#ff6b35',
            primaryGlow: 'rgba(255, 107, 53, 0.35)',
            primaryDim: 'rgba(255, 107, 53, 0.1)',
            secondary: '#00f2fe',
            secondaryGlow: 'rgba(0, 242, 254, 0.35)'
        };
        
        state.distances = [
            { id: "5 KMS", name: "COMPETITIVA", price: 35000, detail: "" },
            { id: "15 KMS", name: "COMPETITIVA", price: 50000, detail: "" }
        ];

        state.categories = [
            { id: "infantiles_4_y_5_años", name: "INFANTILES 4 Y 5 AÑOS 100 MTS", minAge: 4, maxAge: 5 },
            { id: "infantiles_6_y_7_años", name: "INFANTILES 6 Y 7 AÑOS 200 MTS", minAge: 6, maxAge: 7 },
            { id: "infantiles_8_y_9_años", name: "INFANTILES 8 Y 9 AÑOS 400 MTS", minAge: 8, maxAge: 9 },
            { id: "infantiles_10_y_11_años", name: "INFANTILES 10 Y 11 AÑOS 800 MTS", minAge: 10, maxAge: 11 },
            { id: "infantiles_12_y_13_años", name: "INFANTILES 12 Y 13 AÑOS 1200 MTS", minAge: 12, maxAge: 13 },
            { id: "damas_5_kms", name: "DAMAS 5 KMS LIBRE", minAge: 13, maxAge: 80 },
            { id: "caballeros_5_kms_libre", name: "CABALLEROS 5 KMS LIBRE", minAge: 13, maxAge: 80 },
            { id: "damas_15_kms_16_a_19_años", name: "DAMAS 15 KMS 16  A 19 AÑOS", minAge: 16, maxAge: 19 },
            { id: "damas_15_kms_20_a_29_años", name: "DAMAS 15 KMS 20 A 29 AÑOS", minAge: 20, maxAge: 29 },
            { id: "damas_15_kms_30_a_39_años", name: "DAMAS 15 KMS 30 A 39 AÑOS", minAge: 30, maxAge: 39 },
            { id: "damas_15_kms_40_a_49_años", name: "DAMAS 15 KMS 40 A 49 AÑOS", minAge: 40, maxAge: 49 },
            { id: "damas_15_kms_50_a_59_años", name: "DAMAS 15 KMS 50 A 59 AÑOS", minAge: 50, maxAge: 59 },
            { id: "damas_15_kms_60_a_69_años", name: "DAMAS 15 KMS 60 A 69 AÑOS", minAge: 60, maxAge: 69 },
            { id: "15_kms_caballeros_16_a_19_años", name: "15 KMS CABALLEROS 16 A 19 AÑOS", minAge: 16, maxAge: 19 },
            { id: "15_kms_caballeros_20_a_29_años", name: "15 KMS CABALLEROS 20 A 29 AÑOS", minAge: 20, maxAge: 29 },
            { id: "15_kms_caballeros_30_a_39_años", name: "15 KMS CABALLEROS 30 A 39 AÑOS", minAge: 30, maxAge: 39 },
            { id: "15_kms_caballeros_40_a_49_años", name: "15 KMS CABALLEROS 40 A 49 AÑOS", minAge: 40, maxAge: 49 },
            { id: "15_kms_caballeros_50_a_59_años", name: "15 KMS CABALLEROS 50 A 59 AÑOS", minAge: 50, maxAge: 59 },
            { id: "15_kms_caballeros_60_a_69_años", name: "15 KMS CABALLEROS 60 A 69 AÑOS", minAge: 60, maxAge: 69 }
        ];

        populateFormFields();
        renderDistances();
        renderCategories();
        updateJsonPreview();
    }

    // 2. GESTIÓN DE DISTANCIAS
    function renderDistances() {
        distancesList.innerHTML = '';
        if (state.distances.length === 0) {
            distancesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Sin distancias configuradas.</td></tr>`;
            updateCategoriesDistanceSelector();
            return;
        }

        state.distances.forEach((dist, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${dist.id}</strong></td>
                <td>${dist.name}</td>
                <td>$${dist.price.toLocaleString('es-AR')}</td>
                <td style="color: ${dist.autoCategory !== false ? 'var(--accent-cyan)' : 'var(--accent-orange)'}; font-weight: bold;">
                    ${dist.autoCategory !== false ? 'Automática' : 'Manual'}
                </td>
                <td>
                    <small style="display: block; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${dist.detail || ''}">${dist.detail || '-'}</small>
                    ${dist.gpxLink ? `<br><span class="badge" title="${dist.gpxLink}" style="background: rgba(0, 242, 254, 0.1); color: var(--accent-cyan); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; display: inline-block; margin-top: 0.2rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fa-solid fa-route"></i> GPX: ${dist.gpxLink}</span>` : ''}
                    ${dist.stravaLink ? `<br><span class="badge" title="${dist.stravaLink}" style="background: rgba(252, 76, 2, 0.1); color: #fc4c02; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; display: inline-block; margin-top: 0.2rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fa-brands fa-strava"></i> Strava: ${dist.stravaLink}</span>` : ''}
                    ${dist.garminLink ? `<br><span class="badge" title="${dist.garminLink}" style="background: rgba(0, 150, 214, 0.1); color: #0096d6; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; display: inline-block; margin-top: 0.2rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fa-solid fa-compass"></i> Garmin: ${dist.garminLink}</span>` : ''}
                    ${dist.googleEarthLink ? `<br><span class="badge" title="${dist.googleEarthLink}" style="background: rgba(66, 133, 244, 0.1); color: #4285f4; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; display: inline-block; margin-top: 0.2rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fa-solid fa-earth-americas"></i> Earth: ${dist.googleEarthLink}</span>` : ''}
                    ${dist.altitudeMapImage ? `<br><span class="badge" title="${dist.altitudeMapImage}" style="background: rgba(255, 107, 53, 0.1); color: var(--accent-orange); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; display: inline-block; margin-top: 0.2rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fa-solid fa-chart-area"></i> Altimetría: ${dist.altitudeMapImage}</span>` : ''}
                </td>
                <td style="text-align: center; white-space: nowrap;">
                    <button type="button" class="table-action-btn edit-dist-btn" data-index="${index}" title="Editar" style="color: var(--accent-cyan); margin-right: 0.5rem; background: transparent; border: none; cursor: pointer; font-size: 1rem;">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="table-action-btn delete-dist-btn" data-index="${index}" title="Eliminar" style="background: transparent; border: none; cursor: pointer; font-size: 1rem;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;

            row.querySelector('.edit-dist-btn').addEventListener('click', () => {
                startEditingDistance(index);
            });

            row.querySelector('.delete-dist-btn').addEventListener('click', () => {
                state.distances.splice(index, 1);
                if (editingDistanceIndex === index) {
                    cancelEditingDistance();
                } else if (editingDistanceIndex > index) {
                    editingDistanceIndex--;
                }
                renderDistances();
                updateJsonPreview();
            });

            distancesList.appendChild(row);
        });

        // Actualizar el selector de distancias para las categorías
        updateCategoriesDistanceSelector();
    }

    function startEditingDistance(index) {
        editingDistanceIndex = index;
        const dist = state.distances[index];
        
        inputNewDistId.value = dist.id;
        inputNewDistName.value = dist.name;
        inputNewDistPrice.value = dist.price;
        inputNewDistDetail.value = dist.detail || '';
        inputNewDistGpx.value = dist.gpxLink || '';
        inputNewDistStrava.value = dist.stravaLink || '';
        inputNewDistGarmin.value = dist.garminLink || '';
        inputNewDistGoogleEarth.value = dist.googleEarthLink || '';
        inputNewDistAltitude.value = dist.altitudeMapImage || '';
        inputNewDistAutoCategory.checked = dist.autoCategory !== false;

        btnAddDistance.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';
        btnAddDistance.style.background = '#00f2fe';
        btnAddDistance.style.color = '#000';
        btnCancelEditDistance.classList.remove('hidden');

        inputNewDistId.focus();
    }

    function cancelEditingDistance() {
        editingDistanceIndex = null;
        
        inputNewDistId.value = '';
        inputNewDistName.value = '';
        inputNewDistPrice.value = '';
        inputNewDistDetail.value = '';
        inputNewDistGpx.value = '';
        inputNewDistStrava.value = '';
        inputNewDistGarmin.value = '';
        inputNewDistGoogleEarth.value = '';
        inputNewDistAltitude.value = '';
        inputNewDistAutoCategory.checked = true;

        btnAddDistance.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar';
        btnAddDistance.style.background = '';
        btnAddDistance.style.color = '';
        btnCancelEditDistance.classList.add('hidden');
    }

    btnCancelEditDistance.addEventListener('click', cancelEditingDistance);

    btnAddDistance.addEventListener('click', () => {
        const id = inputNewDistId.value.trim().toUpperCase();
        const name = inputNewDistName.value.trim();
        const price = parseFloat(inputNewDistPrice.value);
        const detail = inputNewDistDetail.value.trim();
        const gpxLink = inputNewDistGpx.value.trim();
        const stravaLink = inputNewDistStrava.value.trim();
        const garminLink = inputNewDistGarmin.value.trim();
        const googleEarthLink = inputNewDistGoogleEarth.value.trim();
        const altitudeMapImage = inputNewDistAltitude.value.trim();
        const autoCategory = inputNewDistAutoCategory.checked;

        if (!id || !name || isNaN(price)) {
            alert('Por favor, completa los campos obligatorios para agregar o editar la distancia (Código, Nombre y Precio).');
            return;
        }

        if (editingDistanceIndex !== null) {
            // Modo Edición
            if (state.distances.some((d, idx) => d.id === id && idx !== editingDistanceIndex)) {
                alert('Ya existe otra distancia con ese mismo código ID.');
                return;
            }
            const existingDist = state.distances[editingDistanceIndex];
            state.distances[editingDistanceIndex] = { 
                id, 
                name, 
                price, 
                detail, 
                gpxLink, 
                stravaLink,
                garminLink,
                googleEarthLink,
                altitudeMapImage, 
                autoCategory,
                categories: existingDist.categories || []
            };
            cancelEditingDistance();
        } else {
            // Modo Creación
            if (state.distances.some(d => d.id === id)) {
                alert('Ya existe una distancia con ese mismo código ID.');
                return;
            }
            state.distances.push({ 
                id, 
                name, 
                price, 
                detail, 
                gpxLink, 
                stravaLink,
                garminLink,
                googleEarthLink,
                altitudeMapImage, 
                autoCategory,
                categories: []
            });
            
            inputNewDistId.value = '';
            inputNewDistName.value = '';
            inputNewDistPrice.value = '';
            inputNewDistDetail.value = '';
            inputNewDistGpx.value = '';
            inputNewDistStrava.value = '';
            inputNewDistGarmin.value = '';
            inputNewDistGoogleEarth.value = '';
            inputNewDistAltitude.value = '';
            inputNewDistAutoCategory.checked = true;
        }

        renderDistances();
        updateJsonPreview();
    });

    function updateCategoriesDistanceSelector() {
        if (!selectCatDistance) return;
        
        const previousValue = selectCatDistance.value;
        selectCatDistance.innerHTML = '';
        
        if (state.distances.length === 0) {
            selectCatDistance.innerHTML = '<option value="">-- Primero agrega una distancia --</option>';
            selectCatDistance.disabled = true;
            renderCategories();
            return;
        }
        
        selectCatDistance.disabled = false;
        state.distances.forEach(dist => {
            const opt = document.createElement('option');
            opt.value = dist.id;
            opt.textContent = `${dist.name} (${dist.id})`;
            selectCatDistance.appendChild(opt);
        });
        
        // Mantener selección anterior si todavía existe
        if (previousValue && state.distances.some(d => d.id === previousValue)) {
            selectCatDistance.value = previousValue;
        } else {
            selectCatDistance.value = state.distances[0].id;
        }
        
        renderCategories();
    }

    if (selectCatDistance) {
        selectCatDistance.addEventListener('change', () => {
            resetCategoryEdit();
            renderCategories();
        });
    }

    // 3. GESTIÓN DE CATEGORÍAS
    function renderCategories() {
        categoriesList.innerHTML = '';
        
        const selectedDistId = selectCatDistance ? selectCatDistance.value : '';
        if (!selectedDistId) {
            categoriesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Sin distancia seleccionada. Agrega distancias primero.</td></tr>`;
            return;
        }

        const currentDist = state.distances.find(d => d.id === selectedDistId);
        if (!currentDist) {
            categoriesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">La distancia seleccionada no es válida.</td></tr>`;
            return;
        }

        if (!currentDist.categories) {
            currentDist.categories = [];
        }

        if (currentDist.categories.length === 0) {
            categoriesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Sin categorías configuradas para esta distancia.</td></tr>`;
            return;
        }

        currentDist.categories.forEach((cat, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${cat.id}</code></td>
                <td>${cat.name}</td>
                <td>${cat.minAge} años</td>
                <td>${cat.maxAge === 120 ? 'Más de 60' : cat.maxAge + ' años'}</td>
                <td style="color: ${cat.requiresPayment !== false ? 'var(--accent-orange)' : 'var(--success)'}; font-weight: bold;">
                    ${cat.requiresPayment !== false ? 'Sí' : 'No'}
                </td>
                <td style="text-align: center; display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
                    <button type="button" class="table-action-btn edit-cat-btn" data-index="${index}" style="background: rgba(0, 242, 254, 0.1); color: #00f2fe; border: 1px solid rgba(0, 242, 254, 0.2); padding: 0.35rem 0.55rem; font-size: 0.85rem; cursor: pointer;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="table-action-btn delete-cat-btn" data-index="${index}" style="background: rgba(255, 107, 53, 0.1); color: var(--accent-orange); border: 1px solid rgba(255, 107, 53, 0.2); padding: 0.35rem 0.55rem; font-size: 0.85rem; cursor: pointer;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;

            row.querySelector('.edit-cat-btn').addEventListener('click', () => {
                editingCategoryIndex = index;
                inputNewCatId.value = cat.id;
                inputNewCatName.value = cat.name;
                inputNewCatMin.value = cat.minAge;
                inputNewCatMax.value = cat.maxAge;
                inputNewCatRequiresPayment.checked = cat.requiresPayment !== false;
                
                btnAddCategory.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar';
                if (btnCancelCatEdit) {
                    btnCancelCatEdit.classList.remove('hidden');
                }
                inputNewCatName.focus();
            });

            row.querySelector('.delete-cat-btn').addEventListener('click', () => {
                currentDist.categories.splice(index, 1);
                if (editingCategoryIndex === index) {
                    resetCategoryEdit();
                } else if (editingCategoryIndex > index) {
                    editingCategoryIndex--;
                }
                renderCategories();
                updateJsonPreview();
            });

            categoriesList.appendChild(row);
        });
    }

    function resetCategoryEdit() {
        editingCategoryIndex = null;
        inputNewCatId.value = '';
        inputNewCatName.value = '';
        inputNewCatMin.value = '';
        inputNewCatMax.value = '';
        inputNewCatRequiresPayment.checked = true;
        btnAddCategory.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar';
        if (btnCancelCatEdit) {
            btnCancelCatEdit.classList.add('hidden');
        }
    }

    if (btnCancelCatEdit) {
        btnCancelCatEdit.addEventListener('click', resetCategoryEdit);
    }

    function loadDefaultCategories() {
        resetCategoryEdit();
        
        const selectedDistId = selectCatDistance ? selectCatDistance.value : '';
        if (!selectedDistId) {
            alert('Por favor, selecciona una distancia antes de cargar las categorías estándar.');
            return;
        }

        const currentDist = state.distances.find(d => d.id === selectedDistId);
        if (!currentDist) return;

        currentDist.categories = [
            { id: "juveniles", name: "Juveniles (18 a 29 años)", minAge: 18, maxAge: 29, requiresPayment: true },
            { id: "master_a", name: "Master A (30 a 39 años)", minAge: 30, maxAge: 39, requiresPayment: true },
            { id: "master_b", name: "Master B (40 a 49 años)", minAge: 40, maxAge: 49, requiresPayment: true },
            { id: "master_c", name: "Master C (50 a 59 años)", minAge: 50, maxAge: 59, requiresPayment: true },
            { id: "master_d", name: "Master D (60 años o más)", minAge: 60, maxAge: 120, requiresPayment: true }
        ];

        renderCategories();
        updateJsonPreview();
    }

    btnLoadDefaultCategories.addEventListener('click', loadDefaultCategories);

    btnAddCategory.addEventListener('click', () => {
        const selectedDistId = selectCatDistance ? selectCatDistance.value : '';
        if (!selectedDistId) {
            alert('Por favor, selecciona una distancia primero.');
            return;
        }

        const currentDist = state.distances.find(d => d.id === selectedDistId);
        if (!currentDist) return;

        if (!currentDist.categories) {
            currentDist.categories = [];
        }

        const id = inputNewCatId.value.trim().toLowerCase().replace(/\s+/g, '_');
        const name = inputNewCatName.value.trim();
        const min = parseInt(inputNewCatMin.value);
        const max = parseInt(inputNewCatMax.value);
        const requiresPayment = inputNewCatRequiresPayment.checked;

        if (!id || !name || isNaN(min) || isNaN(max)) {
            alert('Por favor, completa todos los campos de la categoría.');
            return;
        }

        if (min > max) {
            alert('La edad mínima no puede ser mayor que la edad máxima.');
            return;
        }

        if (editingCategoryIndex !== null) {
            // Modo edición
            if (currentDist.categories.some((c, idx) => c.id === id && idx !== editingCategoryIndex)) {
                alert('Ya existe otra categoría con ese identificador interno.');
                return;
            }
            currentDist.categories[editingCategoryIndex] = { id, name, minAge: min, maxAge: max, requiresPayment };
            resetCategoryEdit();
        } else {
            // Modo agregar nuevo
            if (currentDist.categories.some(c => c.id === id)) {
                alert('Ya existe una categoría con ese identificador interno.');
                return;
            }
            currentDist.categories.push({ id, name, minAge: min, maxAge: max, requiresPayment });
            
            // Clear Inputs
            inputNewCatId.value = '';
            inputNewCatName.value = '';
            inputNewCatMin.value = '';
            inputNewCatMax.value = '';
            inputNewCatRequiresPayment.checked = true;
        }

        renderCategories();
        updateJsonPreview();
    });

    // 3.5. ADMINISTRACIÓN DE AUSPICIANTES
    function renderSponsors() {
        sponsorsListBody.innerHTML = '';
        if (!state.sponsors || state.sponsors.length === 0) {
            sponsorsListBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">Sin auspiciantes cargados. Aparecerán marcas de prueba en el portal.</td></tr>`;
            return;
        }

        state.sponsors.forEach((src, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${src}" alt="Preview Sponsor" style="max-height: 45px; max-width: 100px; object-fit: contain; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); padding: 0.2rem;">
                </td>
                <td style="word-break: break-all; font-size: 0.85rem;"><code>${src.substring(0, 50)}${src.length > 50 ? '...' : ''}</code></td>
                <td style="text-align: center;">
                    <button type="button" class="table-action-btn delete-sponsor-btn">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;

            row.querySelector('.delete-sponsor-btn').addEventListener('click', () => {
                state.sponsors.splice(index, 1);
                renderSponsors();
                updateJsonPreview();
            });

            sponsorsListBody.appendChild(row);
        });
    }

    if (btnAddSponsor) {
        btnAddSponsor.addEventListener('click', () => {
            const val = inputNewSponsorLogo.value.trim();
            if (!val) {
                alert('Por favor, ingresa o sube una imagen de auspiciante.');
                return;
            }

            if (!state.sponsors) {
                state.sponsors = [];
            }

            state.sponsors.push(val);
            renderSponsors();
            updateJsonPreview();

            // Clear input
            inputNewSponsorLogo.value = '';
        });
    }

    if (sponsorFileInput) {
        sponsorFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                if (inputNewSponsorLogo) {
                    inputNewSponsorLogo.value = base64;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // 4. LIVE UPDATE STATE & PREVIEW
    const inputsToSync = [
        { el: inputRaceName, prop: 'raceName' },
        { el: inputGoogleScriptUrl, prop: 'googleScriptUrl' },
        { el: inputRaceDescription, prop: 'raceDescription' },
        { el: inputLogoImage, prop: 'logoImage' },
        { el: inputContactWhatsapp, prop: 'contactWhatsapp' },
        { el: inputDeslindeLink, prop: 'deslindeLink' },
        { el: inputClasificacionesLink, prop: 'clasificacionesLink' },
        { el: inputPosterImage, prop: 'posterImage' },
        { el: inputTshirtImage, prop: 'tshirtImage' },
        { el: inputAltitudeMapImage, prop: 'altitudeMapImage' },
        { el: inputKitImage, prop: 'kitImage' },
        { el: inputGpxLink, prop: 'gpxLink' },
        { el: inputKmlLink, prop: 'kmlLink' },
        { el: inputStravaLink, prop: 'stravaLink' },
        { el: inputGarminLink, prop: 'garminLink' },
        { el: inputGoogleEarthLink, prop: 'googleEarthLink' },
        { el: inputStartLocationMapLink, prop: 'startLocationMapLink' },
        { el: inputPaymentDetails, prop: 'paymentDetails' }
    ];

    inputsToSync.forEach(binding => {
        binding.el.addEventListener('input', () => {
            state[binding.prop] = binding.el.value;
            updateJsonPreview();
            modifiedFiles.add('config');
            updateGitHubUploadGuide();
        });
    });

    function getGeneratedConfig() {
        return JSON.stringify(state, null, 2);
    }

    function updateJsonPreview() {
        jsonPreview.textContent = getGeneratedConfig();
        if (!isInitialLoad) {
            modifiedFiles.add('config');
            updateGitHubUploadGuide();
        }
    }

    // 5. COPY & DOWNLOAD ACTIONS
    btnCopyJson.addEventListener('click', () => {
        const jsonText = getGeneratedConfig();
        navigator.clipboard.writeText(jsonText)
            .then(() => alert('¡Configuración JSON copiada al portapapeles!'))
            .catch(err => {
                console.error('Error al copiar:', err);
                alert('No se pudo copiar de forma automática. Selecciona el texto de la vista previa y cópialo manualmente.');
            });
    });

    btnDownloadConfig.addEventListener('click', () => {
        // Validate required fields
        if (!state.raceName || !state.paymentDetails) {
            alert('Por favor, ingresa el Nombre de la Carrera y los Detalles de Pago antes de descargar.');
            return;
        }

        if (state.distances.length === 0) {
            alert('Debes agregar al menos una distancia habilitada.');
            return;
        }

        // Descargar como archivo config.js que declara window.RACE_CONFIG
        const configText = `// Configuración de Carrera autogenerada por el Panel Administrativo
window.RACE_CONFIG = ${JSON.stringify(state, null, 2)};
`;
        const blob = new Blob([configText], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'config.js';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        modifiedFiles.add('config');
        updateGitHubUploadGuide();
    });

    btnSaveDisk.addEventListener('click', async () => {
        // Validate required fields
        if (!state.raceName || !state.paymentDetails) {
            alert('Por favor, ingresa el Nombre de la Carrera y los Detalles de Pago antes de guardar.');
            return;
        }

        if (state.distances.length === 0) {
            alert('Debes agregar al menos una distancia habilitada.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/save-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state)
            });

            const result = await response.json();
            if (result && result.status === 'success') {
                modifiedFiles.add('config');
                updateGitHubUploadGuide();
                
                let successMsg = '¡Configuración guardada en disco con éxito!';
                if (result.newSwVersion) {
                    successMsg += `\n\nSe incrementó automáticamente la versión de sw.js a: ${result.newSwVersion}`;
                }
                successMsg += '\n\nLos cambios ya están listos en tu computadora para subir a GitHub.';
                alert(successMsg);
            } else {
                throw new Error(result.message || 'Respuesta fallida del servidor local.');
            }
        } catch (err) {
            console.error('Error al guardar en disco:', err);
            alert('No se pudo conectar con el servidor local para guardar automáticamente. Asegúrate de tener el servidor corriendo o usa el botón "DESCARGAR CONFIG.JS" para descargarlo y reemplazarlo manualmente.');
        }
    });

    // 6. CONTROLADORES DE SUBIDA DE ARCHIVOS AL SERVIDOR LOCAL
    function setupFileUploader(fileInputId, textInputId) {
        const fileInput = document.getElementById(fileInputId);
        const textInput = document.getElementById(textInputId);

        if (!fileInput || !textInput) return;

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Encontrar el botón de subida que está inmediatamente al lado
            const button = fileInput.nextElementSibling;
            const originalHtml = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo...';

            const reader = new FileReader();
            reader.onload = async () => {
                const base64Data = reader.result;
                try {
                    const response = await fetch('http://localhost:3000/api/upload-file', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fileName: file.name,
                            fileData: base64Data
                        })
                    });

                    const result = await response.json();
                    if (result && result.status === 'success') {
                        // Sincronizar ruta en la entrada de texto
                        textInput.value = result.filePath;
                        textInput.dispatchEvent(new Event('input'));
                        
                        uploadedMediaFiles.add(file.name);
                        updateGitHubUploadGuide();
                        
                        alert(`¡Archivo "${file.name}" subido y guardado exitosamente en tu servidor local!`);
                    } else {
                        throw new Error(result.message || 'Error en la respuesta del servidor.');
                    }
                } catch (err) {
                    console.error('Error al subir archivo:', err);
                    alert(`No se pudo subir el archivo: ${err.message}. Asegúrate de tener el servidor local activo.`);
                } finally {
                    button.disabled = false;
                    button.innerHTML = originalHtml;
                    fileInput.value = ''; // Limpiar campo
                }
            };

            reader.readAsDataURL(file);
        });
    }

    // Inicializar subidores
    setupFileUploader('deslindeLinkFile', 'deslindeLink');
    setupFileUploader('clasificacionesLinkFile', 'clasificacionesLink');
    setupFileUploader('posterImageFile', 'posterImage');
    setupFileUploader('logoImageFile', 'logoImage');
    setupFileUploader('tshirtImageFile', 'tshirtImage');
    setupFileUploader('altitudeMapImageFile', 'altitudeMapImage');
    setupFileUploader('kitImageFile', 'kitImage');
    setupFileUploader('gpxLinkFile', 'gpxLink');
    setupFileUploader('kmlLinkFile', 'kmlLink');
    setupFileUploader('new-dist-gpx-file', 'new-dist-gpx');
    setupFileUploader('new-dist-altitude-file', 'new-dist-altitude');

    // 7. MAPA INTERACTIVO DE LARGADA Y TRAZADO DE RUTA
    function parseCoordsFromUrl(url) {
        if (!url) return null;
        // Extraer de q=lat,lng
        let match = url.match(/q=([-\d.]+),([-\d.]+)/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        // Extraer de query=lat,lng
        match = url.match(/query=([-\d.]+),([-\d.]+)/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        // Extraer si es una coordenada pura lat,lng
        match = url.match(/^([-\d.]+)\s*,\s*([-\d.]+)$/);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        }
        return null;
    }

    function initAdminMap() {
        const mapContainer = document.getElementById('admin-map');
        if (!mapContainer) return;

        // Intentar parsear las coordenadas desde el enlace cargado en el config
        const linkVal = document.getElementById('startLocationMapLink').value.trim();
        let centerCoords = parseCoordsFromUrl(linkVal);
        
        // Si no hay coordenadas válidas, centrar por defecto en Malargüe, Mendoza
        if (!centerCoords) {
            centerCoords = [-35.4746, -69.5847];
        }

        // Inicializar Leaflet si no está ya creado
        if (!adminMap) {
            const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© Colaboradores de OpenStreetMap'
            });

            const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            adminMap = L.map('admin-map', {
                scrollWheelZoom: false,
                layers: [streetMap]
            }).setView(centerCoords, 12);

            const baseMaps = {
                "Mapa de Calles": streetMap,
                "Vista Satélite": satelliteMap
            };

            L.control.layers(baseMaps).addTo(adminMap);

            // Permitir zoom con scroll haciendo clic
            adminMap.on('click', () => {
                if (adminMap.scrollWheelZoom.enabled()) {
                    adminMap.scrollWheelZoom.disable();
                } else {
                    adminMap.scrollWheelZoom.enable();
                }
            });

            // Escuchar clics en el mapa para marcar la largada
            adminMap.on('click', (e) => {
                const isLocked = document.getElementById('lock-start-marker').checked;
                if (isLocked) return;

                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                placeStartMarker(lat, lng);
            });
        } else {
            adminMap.setView(centerCoords, 12);
        }

        // Colocar marcador inicial si había coordenadas
        const coords = parseCoordsFromUrl(linkVal);
        if (coords) {
            placeStartMarker(coords[0], coords[1]);
        }
    }

    function placeStartMarker(lat, lng) {
        const isLocked = document.getElementById('lock-start-marker').checked;

        if (startMarker) {
            startMarker.setLatLng([lat, lng]);
            if (isLocked) {
                startMarker.dragging.disable();
            } else {
                startMarker.dragging.enable();
            }
        } else {
            startMarker = L.marker([lat, lng], {
                draggable: !isLocked
            }).addTo(adminMap);

            startMarker.on('dragend', () => {
                const pos = startMarker.getLatLng();
                updateStartLocationLink(pos.lat, pos.lng);
                if (cityMarker) {
                    recalculateActiveRoute();
                }
            });
        }

        startMarker.bindPopup('<b>Largada de la Carrera</b>').openPopup();
        updateStartLocationLink(lat, lng);
        
        // Si ya hay una ciudad buscada, recalcular la ruta
        if (cityMarker) {
            recalculateActiveRoute();
        }
    }

    function updateStartLocationLink(lat, lng) {
        const input = document.getElementById('startLocationMapLink');
        if (input) {
            // Formato oficial de Google Maps search API que abre directamente la App de Google Maps nativa en celulares
            const newUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
            input.value = newUrl;
            input.dispatchEvent(new Event('input'));
        }
        
        if (inputStartLatitude) inputStartLatitude.value = lat.toFixed(6);
        if (inputStartLongitude) inputStartLongitude.value = lng.toFixed(6);
        
        const viewBtn = document.getElementById('btn-open-start-google-maps');
        if (viewBtn) {
            viewBtn.href = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
        }
    }

    async function searchCityAndRoute() {
        const query = document.getElementById('map-search-input').value.trim();
        if (!query) {
            alert('Por favor, escribe el nombre de la ciudad a la cual medir la ruta en el buscador superior.');
            return;
        }
        if (!startMarker) {
            alert('Por favor, haz clic en cualquier lugar del mapa primero para ubicar la largada de la carrera.');
            return;
        }

        const startLatLng = startMarker.getLatLng();

        // Cambiar estado del botón
        const btn = document.getElementById('btn-calculate-route');
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';

        try {
            // 1. Buscar ciudad con Nominatim
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData || geoData.length === 0) {
                alert('No se encontró ninguna ubicación con ese nombre. Intenta escribir más detallado (ej: "Malargüe, Mendoza").');
                return;
            }

            const cityLat = parseFloat(geoData[0].lat);
            const cityLng = parseFloat(geoData[0].lon);
            const cityName = geoData[0].display_name.split(',')[0];

            // 2. Colocar marcador verde de la ciudad
            if (cityMarker) {
                cityMarker.setLatLng([cityLat, cityLng]);
            } else {
                cityMarker = L.marker([cityLat, cityLng], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(adminMap);
            }
            cityMarker.bindPopup(`<b>Ciudad más cercana: ${cityName}</b>`).openPopup();

            // 3. Trazar ruta con OSRM
            const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${cityLng},${cityLat}?overview=full&geometries=geojson`;
            const routeResponse = await fetch(routeUrl);
            const routeData = await routeResponse.json();

            if (!routeData || !routeData.routes || routeData.routes.length === 0) {
                // Si falla OSRM, línea recta
                const distanceMeters = startLatLng.distanceTo([cityLat, cityLng]);
                drawRouteLine([[startLatLng.lat, startLatLng.lng], [cityLat, cityLng]], distanceMeters, cityName, true);
            } else {
                const route = routeData.routes[0];
                const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                drawRouteLine(routeCoords, route.distance, cityName, false);
            }

        } catch (err) {
            console.error('Error calculando ruta:', err);
            alert('Error de conexión o de geocodificación. Intentando trazar línea recta...');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }

    async function recalculateActiveRoute() {
        if (!startMarker || !cityMarker) return;
        const startLatLng = startMarker.getLatLng();
        const cityLatLng = cityMarker.getLatLng();
        const cityName = cityMarker.getPopup().getContent().replace('<b>Ciudad más cercana: ', '').replace('</b>', '');

        try {
            const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${cityLatLng.lng},${cityLatLng.lat}?overview=full&geometries=geojson`;
            const routeResponse = await fetch(routeUrl);
            const routeData = await routeResponse.json();

            if (!routeData || !routeData.routes || routeData.routes.length === 0) {
                const distanceMeters = startLatLng.distanceTo(cityLatLng);
                drawRouteLine([[startLatLng.lat, startLatLng.lng], [cityLatLng.lat, cityLatLng.lng]], distanceMeters, cityName, true);
            } else {
                const route = routeData.routes[0];
                const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                drawRouteLine(routeCoords, route.distance, cityName, false);
            }
        } catch (e) {
            const distanceMeters = startLatLng.distanceTo(cityLatLng);
            drawRouteLine([[startLatLng.lat, startLatLng.lng], [cityLatLng.lat, cityLatLng.lng]], distanceMeters, cityName, true);
        }
    }

    function drawRouteLine(coordinates, distanceMeters, cityName, isStraightLine) {
        if (routePolyline) {
            adminMap.removeLayer(routePolyline);
        }

        routePolyline = L.polyline(coordinates, {
            color: isStraightLine ? '#ff5252' : '#00e676',
            weight: 5,
            dashArray: isStraightLine ? '10, 10' : null,
            opacity: 0.85
        }).addTo(adminMap);

        // Encuadrar la vista del mapa para mostrar largada y ciudad completa
        const group = new L.featureGroup([startMarker, cityMarker]);
        adminMap.fitBounds(group.getBounds().pad(0.1));

        // Actualizar botón de Google Maps
        const googleMapsBtn = document.getElementById('btn-open-google-maps-route');
        if (googleMapsBtn && startMarker && cityMarker) {
            const startLatLng = startMarker.getLatLng();
            const cityLatLng = cityMarker.getLatLng();
            googleMapsBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${startLatLng.lat},${startLatLng.lng}&destination=${cityLatLng.lat},${cityLatLng.lng}&travelmode=driving`;
        }

        cityNameEl.textContent = cityName;
        distValEl.textContent = `${distKm} km${isStraightLine ? ' (Línea recta/Aérea)' : ' (Por carretera)'}`;
        resultPanel.classList.remove('hidden');
    }

    // Escuchar cambios manuales de la URL de largada para mover el marcador
    document.getElementById('startLocationMapLink').addEventListener('input', () => {
        const val = document.getElementById('startLocationMapLink').value.trim();
        const coords = parseCoordsFromUrl(val);
        if (coords && adminMap) {
            placeStartMarker(coords[0], coords[1]);
            adminMap.setView(coords, 12);
        }
        
        // Sincronizar botón Ver de Google Maps de Largada
        const viewBtn = document.getElementById('btn-open-start-google-maps');
        if (viewBtn) {
            viewBtn.href = val || '#';
        }
    });

    async function searchStartLocation() {
        const query = document.getElementById('map-search-input').value.trim();
        if (!query) {
            alert('Por favor, escribe una ciudad o lugar para buscar la largada en el buscador superior.');
            return;
        }

        const btn = document.getElementById('btn-search-start-loc');
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';

        try {
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData || geoData.length === 0) {
                alert('No se pudo encontrar el lugar ingresado. Intenta con un nombre alternativo o añade la provincia/país.');
                return;
            }

            const lat = parseFloat(geoData[0].lat);
            const lng = parseFloat(geoData[0].lon);

            // Centrar mapa e ir con buen zoom
            adminMap.setView([lat, lng], 14);

            // Posicionar el marcador de largada en el centro de la búsqueda
            placeStartMarker(lat, lng);

        } catch (err) {
            console.error('Error al buscar largada:', err);
            alert('Ocurrió un error al buscar la ubicación en el mapa.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }

    // Registrar el botón de búsqueda de largada
    const btnSearchStart = document.getElementById('btn-search-start-loc');
    if (btnSearchStart) {
        btnSearchStart.addEventListener('click', searchStartLocation);
        document.getElementById('map-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchStartLocation();
            }
        });
    }

    // Registrar el botón de trazado de ruta a la ciudad
    const btnCalc = document.getElementById('btn-calculate-route');
    if (btnCalc) {
        btnCalc.addEventListener('click', searchCityAndRoute);
    }

    // Escuchar el cambio en el checkbox de bloqueo del marcador de largada
    document.getElementById('lock-start-marker').addEventListener('change', (e) => {
        const isLocked = e.target.checked;
        if (startMarker) {
            if (isLocked) {
                startMarker.dragging.disable();
                startMarker.closePopup();
                startMarker.bindPopup('<b>Largada (Bloqueada)</b>').openPopup();
            } else {
                startMarker.dragging.enable();
                startMarker.closePopup();
                startMarker.bindPopup('<b>Largada (Arrastusable)</b>').openPopup();
            }
        }
    });

    // 8. PERSONALIZACIÓN DE TEMAS DE COLOR (TONOS)
    const COLOR_THEMES = {
        orange: {
            primary: '#ff6b35',
            primaryGlow: 'rgba(255, 107, 53, 0.35)',
            primaryDim: 'rgba(255, 107, 53, 0.1)',
            secondary: '#00f2fe',
            secondaryGlow: 'rgba(0, 242, 254, 0.35)'
        },
        green: {
            primary: '#00e676',
            primaryGlow: 'rgba(0, 230, 118, 0.35)',
            primaryDim: 'rgba(0, 230, 118, 0.1)',
            secondary: '#00b0ff',
            secondaryGlow: 'rgba(0, 176, 255, 0.35)'
        },
        blue: {
            primary: '#00f2fe',
            primaryGlow: 'rgba(0, 242, 254, 0.35)',
            primaryDim: 'rgba(0, 242, 254, 0.1)',
            secondary: '#ff007f',
            secondaryGlow: 'rgba(255, 0, 127, 0.35)'
        },
        red: {
            primary: '#ff1744',
            primaryGlow: 'rgba(255, 23, 68, 0.35)',
            primaryDim: 'rgba(255, 23, 68, 0.1)',
            secondary: '#ffeb3b',
            secondaryGlow: 'rgba(255, 235, 59, 0.35)'
        },
        purple: {
            primary: '#e040fb',
            primaryGlow: 'rgba(224, 64, 251, 0.35)',
            primaryDim: 'rgba(224, 64, 251, 0.1)',
            secondary: '#00e5ff',
            secondaryGlow: 'rgba(0, 229, 255, 0.35)'
        }
    };

    function selectColorTheme(themeName) {
        const theme = COLOR_THEMES[themeName];
        if (!theme) return;

        state.themeColors = theme;

        // Aplicar estilos a la página actual en tiempo real
        const root = document.documentElement;
        root.style.setProperty('--accent-orange', theme.primary);
        root.style.setProperty('--accent-orange-glow', theme.primaryGlow);
        root.style.setProperty('--accent-orange-dim', theme.primaryDim);
        root.style.setProperty('--accent-cyan', theme.secondary);
        root.style.setProperty('--accent-cyan-glow', theme.secondaryGlow);

        // Resaltar el botón activo
        document.querySelectorAll('.color-theme-btn').forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === themeName) {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = `0 0 12px ${theme.primaryGlow}`;
                btn.style.background = 'rgba(255,255,255,0.06)';
            } else {
                btn.style.transform = '';
                btn.style.boxShadow = '';
                btn.style.background = '#1a1a1a';
            }
        });

        updateJsonPreview();
    }

    function highlightActiveThemeButton() {
        if (state.themeColors) {
            let activeTheme = 'orange';
            for (const [name, colors] of Object.entries(COLOR_THEMES)) {
                if (colors.primary === state.themeColors.primary) {
                    activeTheme = name;
                    break;
                }
            }
            selectColorTheme(activeTheme);
        }

        highlightActiveBgButton();
        highlightActiveRadiusButton();
    }

    // 9. PERSONALIZACIÓN DE FONDOS DE LA WEB
    const BACKGROUND_THEMES = {
        default: './assets/trail_background.jpg',
        snow: './assets/snow_mountain.jpg',
        sunset: './assets/sunset_ridge.jpg',
        rocky: './assets/rocky_valley.jpg',
        solid: 'none'
    };

    function selectBgTheme(bgName) {
        const bgPath = BACKGROUND_THEMES[bgName] || BACKGROUND_THEMES.default;
        state.themeBackground = bgName;

        const bgOverlay = document.getElementById('bg-overlay');
        if (bgOverlay) {
            if (bgPath === 'none') {
                bgOverlay.style.backgroundImage = 'none';
            } else {
                bgOverlay.style.backgroundImage = `url('${bgPath}')`;
            }
        }

        // Resaltar el botón activo y desmarcar el resto
        document.querySelectorAll('.bg-theme-btn').forEach(btn => {
            const btnBg = btn.getAttribute('data-bg');
            if (btnBg === bgName) {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 0 12px rgba(255,107,53,0.3)';
                btn.style.background = 'rgba(255,255,255,0.06)';
            } else {
                btn.style.transform = '';
                btn.style.boxShadow = '';
                btn.style.background = '#1a1a1a';
            }
        });

        updateJsonPreview();
    }

    function highlightActiveBgButton() {
        const activeBg = state.themeBackground || 'default';
        selectBgTheme(activeBg);
    }

    // 9.2 PERSONALIZACIÓN DE BORDER RADIUS
    function selectRadiusTheme(radiusValue) {
        state.borderRadiusStyle = radiusValue;

        // Cambiar dinámicamente las variables de border-radius del admin para previsualizar
        const root = document.documentElement;
        root.style.setProperty('--radius-md', radiusValue);
        const numVal = parseInt(radiusValue);
        if (numVal === 0) {
            root.style.setProperty('--radius-lg', '0px');
            root.style.setProperty('--radius-sm', '0px');
        } else {
            root.style.setProperty('--radius-lg', (numVal + 4) + 'px');
            root.style.setProperty('--radius-sm', (numVal - 4) + 'px');
        }

        // Resaltar el botón activo y desmarcar el resto
        document.querySelectorAll('.radius-btn').forEach(btn => {
            const btnRadius = btn.getAttribute('data-radius');
            if (btnRadius === radiusValue) {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 0 12px rgba(0,242,254,0.3)';
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.borderColor = 'var(--accent-cyan)';
            } else {
                btn.style.transform = '';
                btn.style.boxShadow = '';
                btn.style.background = '#1a1a1a';
                btn.style.borderColor = '#555';
            }
        });

        updateJsonPreview();
    }

    function highlightActiveRadiusButton() {
        const activeRadius = state.borderRadiusStyle || '12px';
        selectRadiusTheme(activeRadius);
    }

    // Registrar eventos de clic en los botones de selección de tema, fondo y esquinas
    document.querySelectorAll('.color-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const themeName = btn.getAttribute('data-theme');
            selectColorTheme(themeName);
        });
    });

    document.querySelectorAll('.bg-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bgName = btn.getAttribute('data-bg');
            selectBgTheme(bgName);
        });
    });

    document.querySelectorAll('.radius-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const radiusValue = btn.getAttribute('data-radius');
            selectRadiusTheme(radiusValue);
        });
    });

    function handleCoordsInputChange() {
        const lat = parseFloat(inputStartLatitude.value);
        const lng = parseFloat(inputStartLongitude.value);
        if (!isNaN(lat) && !isNaN(lng)) {
            const isLocked = document.getElementById('lock-start-marker').checked;
            if (startMarker) {
                startMarker.setLatLng([lat, lng]);
                if (isLocked) {
                    startMarker.dragging.disable();
                } else {
                    startMarker.dragging.enable();
                }
            } else {
                startMarker = L.marker([lat, lng], {
                    draggable: !isLocked
                }).addTo(adminMap);

                startMarker.on('dragend', () => {
                    const pos = startMarker.getLatLng();
                    updateStartLocationLink(pos.lat, pos.lng);
                    if (cityMarker) {
                        recalculateActiveRoute();
                    }
                });
            }

            startMarker.bindPopup('<b>Largada de la Carrera</b>').openPopup();
            
            const inputLink = document.getElementById('startLocationMapLink');
            if (inputLink) {
                inputLink.value = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
                inputLink.dispatchEvent(new Event('input'));
            }
            
            const viewBtn = document.getElementById('btn-open-start-google-maps');
            if (viewBtn) {
                viewBtn.href = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
            }

            if (adminMap) {
                adminMap.setView([lat, lng], adminMap.getZoom() || 12);
            }
            
            if (cityMarker) {
                recalculateActiveRoute();
            }
        }
    }

    if (inputStartLatitude) {
        inputStartLatitude.addEventListener('input', handleCoordsInputChange);
        inputStartLatitude.addEventListener('change', handleCoordsInputChange);
    }
    if (inputStartLongitude) {
        inputStartLongitude.addEventListener('input', handleCoordsInputChange);
        inputStartLongitude.addEventListener('change', handleCoordsInputChange);
    }

    // ==========================================
    // CREAR NUEVA CARRERA (CLONAR PROYECTO)
    // ==========================================
    const btnCreateNewRace = document.getElementById('btn-create-new-race');
    if (btnCreateNewRace) {
        btnCreateNewRace.addEventListener('click', async () => {
            const confirmClone = confirm(
                'Esta acción creará una copia completa de este portal en una nueva carpeta en tu computadora, permitiéndote configurar otra carrera diferente manteniendo la actual activa.\n\n¿Deseas continuar?'
            );
            
            if (!confirmClone) return;

            const newName = prompt(
                'Ingresa el nombre de la nueva carrera (usa solo letras, números y guiones, sin espacios):\nEjemplo: valle-grande-2026'
            );

            if (!newName || newName.trim() === '') {
                alert('Operación cancelada o nombre no válido.');
                return;
            }

            const cleanName = newName.trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '_');

            try {
                btnCreateNewRace.disabled = true;
                btnCreateNewRace.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Copiando...';

                const response = await fetch('http://localhost:3000/api/clone-project', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newProjectName: cleanName })
                });

                const result = await response.json();
                if (result && result.status === 'success') {
                    alert(
                        `¡NUEVA CARRERA CREADA CON ÉXITO!\n\nSe creó la carpeta:\n📂 ${result.newFolderPath}\n\nPara empezar a configurarla:\n1. Abre una consola de comandos en esa nueva carpeta.\n2. Ejecuta "node server.js"\n3. Abre "http://localhost:3000/admin.html" en tu navegador.`
                    );
                } else {
                    throw new Error(result.message || 'Error desconocido al clonar.');
                }
            } catch (err) {
                console.error('Error al clonar proyecto:', err);
                alert(`No se pudo crear la nueva carrera de forma automática:\n${err.message}`);
            } finally {
                btnCreateNewRace.disabled = false;
                btnCreateNewRace.innerHTML = '<i class="fa-solid fa-folder-plus"></i> Crear Nueva Carrera';
            }
        });
    }

    // INIT
    loadConfig();
});
