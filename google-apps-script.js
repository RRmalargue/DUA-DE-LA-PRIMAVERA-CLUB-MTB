/**
 * GOOGLE APPS SCRIPT - PLANILLA INTELIGENTE Y AUTOMATIZADA CON DISEÑO PREMIUM
 * 
 * ÚLTIMA MODIFICACIÓN: 17 de agosto de 2026, 16:50 (Versión limpia vinculada sin IDs fijos)
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Abre tu nueva planilla de inscripciones de Google Sheets.
 * 2. En la barra de menú superior, ve a Extensiones -> Apps Script.
 * 3. Borra todo el código que aparezca en el editor y pega este archivo completo.
 * 4. Guarda el proyecto haciendo clic en el icono del disco (Guardar).
 * 5. Haz clic en "Implementar" -> "Gestionar implementaciones".
 * 6. Edita la implementación actual (ícono del lápiz), selecciona "Nueva versión" en el menú desplegable y haz clic en "Implementar".
 * 7. ¡Listo! La planilla se actualizará.
 */

// Función principal que recibe las peticiones POST de la web
function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    
    // 1 y 2. Obtener carpeta y subir el comprobante de pago a Google Drive (Protegido en try-catch)
    var fileUrl = "";
    try {
      if (requestData.comprobante_base64 && requestData.comprobante_nombre) {
        var folderName = "Comprobantes_" + (requestData.raceName || "Carrera_Trail").replace(/[^a-zA-Z0-9_]/g, "_");
        var folder = getOrCreateFolder(folderName);
        fileUrl = saveFileToDrive(
          folder, 
          requestData.comprobante_base64, 
          requestData.comprobante_tipo, 
          requestData.comprobante_nombre,
          requestData.nombre + "_" + requestData.apellido + "_" + requestData.cuil
        );
      }
    } catch (eDrive) {
      Logger.log("Error al subir archivo a Drive: " + eDrive.toString());
      fileUrl = "Comprobante cargado (Error de permisos en Drive)";
    }
    
    // Detectar automáticamente la planilla vinculada
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Inscripciones");
    
    // Si no existe la pestaña "Inscripciones", usar la hoja activa o crearla
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName("Inscripciones");
    }
    
    // 3. Normalizar datos base para el registro (Protegido en try-catch)
    var birthDate = requestData.fecha_nacimiento || '';
    try {
      if (birthDate.indexOf('-') !== -1) {
        var dateParts = birthDate.split('-');
        if (dateParts.length === 3) {
          birthDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
        }
      }
    } catch (eDate) {
      Logger.log("Error al normalizar fecha nacimiento: " + eDate.toString());
    }
    
    var genderVal = requestData.genero || '';
    if (genderVal === 'Femenino') {
      genderVal = 'Damas';
    } else if (genderVal === 'Masculino') {
      genderVal = 'Caballeros';
    }

    // 4. Construir objeto de datos base
    var record = {
      "Fecha de Registro": formatDate(requestData.timestamp),
      "Nombre": requestData.nombre,
      "Apellido": requestData.apellido,
      "CUIL": formatCUIL(requestData.cuil),
      "Fecha Nacimiento": birthDate,
      "Edad": requestData.edad,
      "Género": genderVal,
      "Categoría": requestData.categoria,
      "Teléfono": requestData.telefono,
      "Talle Remera": requestData.talle_remera,
      "Team o Lugar de Origen": requestData.team_origen || '',
      "Distancia": requestData.distancia,
      "Costo Abonado ($)": Number(requestData.costo),
      "Comprobante": fileUrl ? (fileUrl.indexOf('http') === 0 ? '=HYPERLINK("' + fileUrl + '"; "Ver Comprobante 📄")' : fileUrl) : 'Sin comprobante'
    };

    // 5. Agregar automáticamente campos personalizados (ej: "custom_numero_de_licencia_facimo" -> "Numero De Licencia Facimo")
    Object.keys(requestData).forEach(function(key) {
      if (key.indexOf('custom_') === 0) {
        var cleanHeader = key.substring(7)
          .replace(/_/g, ' ')
          .split(' ')
          .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        
        record[cleanHeader] = requestData[key];
      }
    });

    // Cabecera especial para control de pagos
    var estadoHeader = "Estado Pago";
    record[estadoHeader] = "Pendiente ⏳";

    // 6. Gestionar columnas del Sheet de manera dinámica y robusta
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var currentHeaders = [];
    
    if (lastRow > 0 && lastCol > 0) {
      currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
        return String(h).trim();
      });
    } else {
      // Planilla nueva: inicializar con columnas estándar
      currentHeaders = [
        "Fecha de Registro", "Nombre", "Apellido", "CUIL", "Fecha Nacimiento", 
        "Edad", "Género", "Categoría", "Teléfono", "Talle Remera", 
        "Team o Lugar de Origen", "Distancia", "Costo Abonado ($)", "Comprobante", "Estado Pago"
      ];
      sheet.appendRow(currentHeaders);
      
      lastRow = 1;
      lastCol = currentHeaders.length;
    }

    // --- CREACIÓN DEL PANEL DE RESUMEN (DASHBOARD) PROTEGIDO EN TRY-CATCH ---
    try {
      var resumenSheet = ss.getSheetByName("Resumen");
      if (!resumenSheet) {
        resumenSheet = ss.insertSheet("Resumen");
        
        // Estilo del Título Principal
        resumenSheet.getRange("A1:C1").merge()
                    .setValue("📊 PANEL DE CONTROL DE ACUMULADOS")
                    .setFontFamily("Arial")
                    .setFontSize(13)
                    .setFontWeight("bold")
                    .setFontColor("#ffffff")
                    .setBackground("#0f172a") // Azul oscuro
                    .setHorizontalAlignment("center")
                    .setVerticalAlignment("middle");
        resumenSheet.setRowHeight(1, 38);
        
        // KPI 1: Inscriptos (Fondo gris neutro)
        resumenSheet.getRange("A3").setValue("Corredores Inscriptos 👥")
                    .setFontFamily("Arial").setFontSize(10).setFontWeight("bold").setFontColor("#475569").setBackground("#f8fafc");
        resumenSheet.getRange("B3").setFormula("=COUNTA(Inscripciones!B2:B)")
                    .setFontFamily("Arial").setFontSize(12).setFontWeight("bold").setFontColor("#0f172a").setBackground("#f1f5f9").setHorizontalAlignment("right");
        
        // KPI 2: Total Recaudado (Fondo verde claro de éxito)
        resumenSheet.getRange("A4").setValue("Total Recaudado (Aprobado) 💵")
                    .setFontFamily("Arial").setFontSize(10).setFontWeight("bold").setFontColor("#15803d").setBackground("#f0fdf4");
        resumenSheet.getRange("B4").setFormula('=SUMIF(Inscripciones!O:O, "Aprobado ✅", Inscripciones!M:M)')
                    .setFontFamily("Arial").setFontSize(12).setFontWeight("bold").setFontColor("#16a34a").setBackground("#dcfce7").setHorizontalAlignment("right").setNumberFormat("$#,##0");
        
        // KPI 3: Monto Pendiente (Fondo amarillo de atención)
        resumenSheet.getRange("A5").setValue("Monto Pendiente de Pago ⏳")
                    .setFontFamily("Arial").setFontSize(10).setFontWeight("bold").setFontColor("#a16207").setBackground("#fefce8");
        resumenSheet.getRange("B5").setFormula('=SUMIF(Inscripciones!O:O, "Pendiente ⏳", Inscripciones!M:M)')
                    .setFontFamily("Arial").setFontSize(12).setFontWeight("bold").setFontColor("#ca8a04").setBackground("#fef08a").setHorizontalAlignment("right").setNumberFormat("$#,##0");
        
        // Bordes finos y grises para separar las métricas
        resumenSheet.getRange("A3:B5").setBorder(true, true, true, true, true, true, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);
        
        // Título de la sección de desglose por distancias
        resumenSheet.getRange("A7:C7").merge()
                    .setValue("📈 DESGLOSE AUTOMÁTICO POR DISTANCIAS")
                    .setFontFamily("Arial")
                    .setFontSize(11)
                    .setFontWeight("bold")
                    .setFontColor("#ffffff")
                    .setBackground("#334155") // Gris oscuro
                    .setHorizontalAlignment("center")
                    .setVerticalAlignment("middle");
        resumenSheet.setRowHeight(7, 28);
        
        // QUERY dinámica para listar distancias, corredores e ingresos de cada una
        resumenSheet.getRange("A8").setFormula('=QUERY(Inscripciones!A1:O, "select L, count(B), sum(M) where B is not null and B <> \'Nombre\' group by L label L \'Distancia / Circuito\', count(B) \'Inscriptos\', sum(M) \'Total ($)\'", 1)');
        
        // Estilo de la cabecera de la tabla dinámica
        resumenSheet.getRange("A8:C8")
                    .setFontFamily("Arial")
                    .setFontSize(10)
                    .setFontWeight("bold")
                    .setFontColor("#ffffff")
                    .setBackground("#475569")
                    .setHorizontalAlignment("center");
        
        resumenSheet.autoResizeColumns(1, 3);
      }
    } catch (eResumen) {
      Logger.log("Error al crear pestaña Resumen: " + eResumen.toString());
    }

    // Pintar la cabecera de la pestaña Inscripciones (protegido en try-catch)
    try {
      sheet.getRange(1, 1, 1, lastCol)
           .setFontFamily("Arial")
           .setFontSize(10)
           .setFontWeight("bold")
           .setBackground("#0f172a")
           .setFontColor("#ffffff")
           .setHorizontalAlignment("center");
    } catch (eHeaderStyle) {
      Logger.log("Error al pintar cabecera: " + eHeaderStyle.toString());
    }

    // Verificar dinámicamente si hay campos nuevos para crear columnas
    Object.keys(record).forEach(function(key) {
      var headerIndex = findHeaderIndex(currentHeaders, key);
      if (headerIndex === -1) {
        var insertPos = lastCol + 1;
        var estadoIdx = findHeaderIndex(currentHeaders, estadoHeader);
        // Insertar antes del "Estado Pago" si ya existe
        if (estadoIdx !== -1 && key !== estadoHeader) {
          insertPos = estadoIdx + 1;
          try {
            sheet.insertColumnBefore(insertPos);
          } catch (eInsertCol) {
            Logger.log("Error al insertar columna: " + eInsertCol.toString());
            insertPos = sheet.getLastColumn() + 1; // Fallback al final si falla la inserción intermedia
          }
          currentHeaders.splice(estadoIdx, 0, key);
        } else {
          currentHeaders.push(key);
        }
        
        try {
          sheet.getRange(1, insertPos).setValue(key)
               .setFontFamily("Arial")
               .setFontSize(10)
               .setFontWeight("bold")
               .setBackground("#0f172a")
               .setFontColor("#ffffff")
               .setHorizontalAlignment("center");
        } catch (eSetVal) {
          Logger.log("Error al escribir cabecera de columna nueva: " + eSetVal.toString());
        }
             
        lastCol = sheet.getLastColumn();
      }
    });

    // Recargar cabeceras de forma segura
    currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function(h) {
      return String(h).trim();
    });

    // Mapear el registro a los encabezados del excel (tolerante a alias y acentos)
    var newRowValues = currentHeaders.map(function(header) {
      var matchedKey = null;
      Object.keys(record).forEach(function(key) {
        var aliases = {
          "comprobante": ["enlace comprobante (drive)", "enlace comprobante", "comprobante de pago", "comprobante"],
          "costo abonado ($)": ["costo", "costo abonado", "costo abonado ($)", "monto"],
          "team o lugar de origen": ["team", "lugar de origen", "team o lugar de origen", "team / procedencia"],
          "fecha nacimiento": ["fecha nacimiento", "fecha de nacimiento", "nacimiento"]
        };
        var cleanHeader = removeAccents(String(header).trim().toLowerCase());
        var cleanKey = removeAccents(String(key).trim().toLowerCase());
        
        if (cleanHeader === cleanKey) {
          matchedKey = key;
        } else if (aliases[cleanKey]) {
          for (var j = 0; j < aliases[cleanKey].length; j++) {
            var cleanAlias = removeAccents(aliases[cleanKey][j].trim().toLowerCase());
            if (cleanHeader === cleanAlias) {
              matchedKey = key;
              break;
            }
          }
        }
      });
      
      return matchedKey !== null ? record[matchedKey] : '';
    });
    
    sheet.appendRow(newRowValues);
    var targetRow = sheet.getLastRow();
    
    // Configurar dropdown interactivo de Estado Pago (protegido en try-catch)
    var estadoColIndex = findHeaderIndex(currentHeaders, estadoHeader) + 1;
    if (estadoColIndex > 0) {
      try {
        var cell = sheet.getRange(targetRow, estadoColIndex);
        var rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(["Pendiente ⏳", "Aprobado ✅", "Rechazado ❌"], true)
          .setAllowInvalid(false)
          .setHelpText("Verifica y aprueba el pago del corredor aquí")
          .build();
        cell.setDataValidation(rule);
        
        cell.setBackground("#fef08a");
        cell.setFontColor("#854d0e");
        cell.setFontWeight("bold");
        cell.setHorizontalAlignment("center");
      } catch (eDropdown) {
        Logger.log("Error al crear dropdown: " + eDropdown.toString());
      }
    }

    // Configurar formato condicional (protegido en try-catch)
    try {
      setupConditionalFormatting(sheet, estadoColIndex);
    } catch (eCondFormatting) {
      Logger.log("Error en formato condicional: " + eCondFormatting.toString());
    }

    // Ajustar columnas de forma segura
    try {
      sheet.autoResizeColumns(1, lastCol);
    } catch (eResize) {
      Logger.log("Error al autoajustar columnas: " + eResize.toString());
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registro procesado exitosamente"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error general en doPost: " + error.toString());
    
    // INTENTAR GUARDAR EL ERROR DIRECTAMENTE EN LA PLANILLA EN UNA PESTAÑA ESPECIAL "LogErrores"
    try {
      var ssErr = SpreadsheetApp.getActiveSpreadsheet();
      if (ssErr) {
        var logSheet = ssErr.getSheetByName("LogErrores");
        if (!logSheet) {
          logSheet = ssErr.insertSheet("LogErrores");
          logSheet.appendRow(["Fecha y Hora", "Función", "Mensaje de Error", "Pila de llamadas"]);
          logSheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#fee2e2").setFontColor("#b91c1c");
        }
        logSheet.appendRow([new Date(), "doPost", error.toString(), error.stack || '']);
        logSheet.autoResizeColumns(1, 4);
      }
    } catch (eLog) {
      // Ignorar si también falla el guardado de error
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función tolerante a acentos, mayúsculas, minúsculas, espacios y alias
function findHeaderIndex(headers, key) {
  var cleanKey = removeAccents(String(key).trim().toLowerCase());
  
  var aliases = {
    "comprobante": ["enlace comprobante (drive)", "enlace comprobante", "comprobante de pago", "comprobante"],
    "costo abonado ($)": ["costo", "costo abonado", "costo abonado ($)", "monto"],
    "team o lugar de origen": ["team", "lugar de origen", "team o lugar de origen", "team / procedencia"],
    "fecha nacimiento": ["fecha nacimiento", "fecha de nacimiento", "nacimiento"]
  };
  
  for (var i = 0; i < headers.length; i++) {
    var cleanHeader = removeAccents(String(headers[i]).trim().toLowerCase());
    if (cleanHeader === cleanKey) return i;
    
    if (aliases[cleanKey]) {
      for (var j = 0; j < aliases[cleanKey].length; j++) {
        var cleanAlias = removeAccents(aliases[cleanKey][j].trim().toLowerCase());
        if (cleanHeader === cleanAlias) return i;
      }
    }
  }
  return -1;
}

// Helper para eliminar acentos / tildes
function removeAccents(str) {
  return str
    .replace(/[áäâà]/gi, "a")
    .replace(/[éëêè]/gi, "e")
    .replace(/[íïîì]/gi, "i")
    .replace(/[óöôò]/gi, "o")
    .replace(/[úüûù]/gi, "u")
    .replace(/ñ/gi, "n");
}

// Busca o crea la carpeta de almacenamiento de comprobantes en Drive
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Guarda un archivo decodificado en Base64 directamente a Drive y retorna su URL
function saveFileToDrive(folder, base64Data, contentType, fileName, runnerName) {
  var decoded = Utilities.base64Decode(base64Data);
  var ext = "";
  var parts = fileName.split('.');
  if (parts.length > 1) {
    ext = "." + parts.pop();
  }
  var newFileName = runnerName + "_Comprobante" + ext;
  var blob = Utilities.newBlob(decoded, contentType, newFileName);
  var file = folder.createFile(blob);
  
  // Cambiar permisos para que cualquiera con el enlace lo vea (protegido en try-catch para Workspace corporativo)
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (eSharing) {
    Logger.log("Error al cambiar permisos de archivo en Drive: " + eSharing.toString());
  }
  
  return file.getUrl();
}

// Formatear CUIL numérico de 11 dígitos a XX-XXXXXXXX-X (Protegido en try-catch)
function formatCUIL(cuil) {
  try {
    if (!cuil) return '';
    var cuilStr = String(cuil).replace(/\D/g, ''); // Deja solo dígitos
    if (cuilStr.length !== 11) return String(cuil);
    return cuilStr.substring(0, 2) + "-" + cuilStr.substring(2, 10) + "-" + cuilStr.substring(10);
  } catch (e) {
    return String(cuil || '');
  }
}

// Formatear fecha y hora UTC a formato legible local (Argentina GMT-3)
function formatDate(isoString) {
  try {
    if (!isoString) return new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    var date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    }
    return Utilities.formatDate(date, "America/Argentina/Buenos_Aires", "dd/MM/yyyy HH:mm:ss");
  } catch (e) {
    return new Date().toLocaleString();
  }
}

// Configura formato condicional de forma ultra segura
function setupConditionalFormatting(sheet, colIndex) {
  if (colIndex <= 0) return;
  
  var rules = sheet.getConditionalFormatRules();
  if (rules.length > 0) return; // Si ya hay reglas, no duplicarlas

  // Obtener el número real de filas de la hoja para evitar desbordamiento de rango
  var maxRows = sheet.getMaxRows();
  var range = sheet.getRange(2, colIndex, maxRows - 1, 1);
  
  var ruleApproved = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Aprobado ✅")
    .setBackground("#dcfce7")
    .setFontColor("#15803d")
    .setRanges([range])
    .build();
    
  var ruleRejected = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Rechazado ❌")
    .setBackground("#fee2e2")
    .setFontColor("#b91c1c")
    .setRanges([range])
    .build();

  var rulePending = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Pendiente ⏳")
    .setBackground("#fef08a")
    .setFontColor("#854d0e")
    .setRanges([range])
    .build();

  sheet.setConditionalFormatRules([ruleApproved, ruleRejected, rulePending]);
}
