// Backend für die "Virtuelle Kerze" auf wendalinuskapelle-ludweiler.de
// Einrichtung: siehe apps-script/SETUP.md

var SHEET_NAME = 'Kerzen';
var MAX_MESSAGE_LENGTH = 300;
var MAX_NAME_LENGTH = 60;
var MAX_ENTRIES_RETURNED = 30;

function doGet(e) {
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();

  var entries = rows.slice(1)
    .filter(function (r) { return r[2]; })
    .map(function (r) {
      return {
        zeit: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        name: r[1] || 'Anonym',
        nachricht: r[2]
      };
    })
    .reverse()
    .slice(0, MAX_ENTRIES_RETURNED);

  return jsonOutput_(entries);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot-Feld: Bots füllen verstecke Felder aus, Menschen nicht.
    if (data.website) {
      return jsonOutput_({ ok: true });
    }

    var message = (data.message || '').toString().trim();
    var name = (data.name || '').toString().trim();

    if (!message) {
      return jsonOutput_({ ok: false, error: 'Nachricht fehlt' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      message = message.slice(0, MAX_MESSAGE_LENGTH);
    }
    if (name.length > MAX_NAME_LENGTH) {
      name = name.slice(0, MAX_NAME_LENGTH);
    }

    getSheet_().appendRow([new Date(), name, message]);

    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: 'Fehler beim Speichern' });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Zeitstempel', 'Name', 'Nachricht']);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
