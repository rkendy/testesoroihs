const GOOGLE_FORM_ID = "1ERbZ3bgTHpkL634y14DZuW_NkSVsL3jSavK54G8qyCI";
const GOOGLE_SPREADSHEET_ID = "1-2DCD4Y2AtDinJNY-VwbsyHJkHj8t9vkMpZAgtIbmQY";
// const GOOGLE_FORM_IDS = [
//   {
//     formId: '1ERbZ3bgTHpkL634y14DZuW_NkSVsL3jSavK54G8qyCI',
//     formItemId: '416287583',
//     name: 'Respostas ao formulário 1',
//     columnId: 1 
//   },
//   {
//     formId: '1fi7yfcvTM-IxQCODlxvM3-IxJP9RxNvMzIbpqHtQ_X8',
//     formItemId: '416287583',
//     name: 'Respostas ao formulário 2',
//     columnId: 2
//   },
//   {
//     formId: '1etGAia7Qi5wcxSp96X7VckQQ1q34wlvR8BA-OeHzKqM',
//     formItemId: '416287583',
//     name: 'Respostas ao formulário 3',
//     columnId: 3
//   }
// ]

function onFormSubmit(event) {
  // Logger.log(JSON.stringify(event));
  // const currentSheetName = SpreadsheetApp.getActiveSpreadsheet().getSheetName();
  // Logger.log(currentSheetName);
  const dataHora = event.range.getCell(1,4).getValue();
  eraseItem(dataHora);
  populateList();
}

function eraseItem(dataHora) {
  const targetSheet = SpreadsheetApp.openById(GOOGLE_SPREADSHEET_ID).getSheetByName('Disponiveis');
  var r = targetSheet.getRange('A:A');
  var v = r.getValues();
  for(var i=v.length-1;i>=0;i--) {
    if(v[0,i]==dataHora) {
      targetSheet.deleteRow(i+1);
      return;
    }
  }
}


function populateList() {
  var list = FormApp.openById(GOOGLE_FORM_ID).getItemById("416287583");
  // const reg = GOOGLE_FORM_IDS.find( element => element.name === currentSheetName);  
  // var list = FormApp.openById(reg.formId).getItemById(reg.formItemId);
  list.asListItem().setChoiceValues(getAvailableHours());
}

function getAvailableHours() {
  const targetSheet = SpreadsheetApp.openById(GOOGLE_SPREADSHEET_ID).getSheetByName('Disponiveis');
  const lastRow = targetSheet.getLastRow();
  const sourceRange = targetSheet.getRange(1, 1, lastRow, 1);
  // const filtered = sourceRange.getValues().filter(elem => elem[1] == columnId);
  // return filtered.map(e => e[0]);
  return sourceRange.getValues();
}



function viewIds() {
  Logger.log(GOOGLE_FORM_IDS.length)
  for(ii=0 ; ii<GOOGLE_FORM_IDS.length ; ii++) {
    Logger.log(GOOGLE_FORM_IDS[ii].formId);
    var form = FormApp.openById(GOOGLE_FORM_IDS[ii].formId);
    var items = form.getItems();
    for (var i in items) { 
      Logger.log(items[i].getTitle() + ': ' + items[i].getId());
    }
  }
}


const populateGoogleForms = () => {
  const GOOGLE_SHEET_NAME = "Respostas ao formulário 1";
  

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const [header, ...data] = ss
    .getSheetByName(GOOGLE_SHEET_NAME)
    .getDataRange()
    .getDisplayValues();

  const choices = {};
  header.forEach((title, i) => {
    choices[title] = data.map((d) => d[i]).filter((e) => e);
  });

  FormApp.openById(GOOGLE_FORM_ID).getItemById()
    .getItems()
    .map((item) => ({
      item,
      values: choices[item.getTitle()],
    }))
    .filter(({ values }) => values)
    .forEach(({ item, values }) => {
      switch (item.getType()) {
        case FormApp.ItemType.CHECKBOX:
          item.asCheckboxItem().setChoiceValues(values);
          break;
        case FormApp.ItemType.LIST:
          item.asListItem().setChoiceValues(values);
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          item.asMultipleChoiceItem().setChoiceValues(values);
          break;
        default:
        // ignore item
      }
    });
  ss.toast("Google Form Updated !!");
};