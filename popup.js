// DOM要素
const listPriceInput = document.getElementById('listPrice');
const discountRateInput = document.getElementById('discountRate');
const sellingRateInput = document.getElementById('sellingRate');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultDiv = document.getElementById('result');
const basePriceSpan = document.getElementById('basePrice');
const sellingPriceSpan = document.getElementById('sellingPrice');

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const loadSettingsBtn = document.getElementById('loadSettingsBtn');
const clearSettingsBtn = document.getElementById('clearSettingsBtn');

// 計算関数
function calculate() {
  const listPrice = parseFloat(listPriceInput.value);
  const discountRate = parseFloat(discountRateInput.value);
  const sellingRateValue = sellingRateInput.value;

  // 入力値のバリデーション
  if (isNaN(listPrice) || listPrice < 0) {
    alert('定価を正しく入力してください');
    return;
  }

  if (isNaN(discountRate) || discountRate <= 0 || discountRate > 1) {
    alert('掛け率を選択してください');
    return;
  }

  if (!sellingRateValue) {
    alert('販売価格率を選択してください');
    return;
  }

  // 販売価格率を計算
  let sellingRate;
  if (sellingRateValue === 'plus5') {
    // 掛け率 + 5%
    sellingRate = (discountRate * 100) + 5;
  } else if (sellingRateValue === 'plus10') {
    // 掛け率 + 10%
    sellingRate = (discountRate * 100) + 10;
  } else {
    // 固定値（70% または 80%）
    sellingRate = parseFloat(sellingRateValue);
  }

  // 計算
  const basePrice = listPrice * discountRate;
  const sellingPrice = basePrice * (sellingRate / 100);

  // 結果を表示
  basePriceSpan.textContent = `¥${Math.round(basePrice).toLocaleString()}`;
  sellingPriceSpan.textContent = `¥${Math.round(sellingPrice).toLocaleString()} (${Math.round(sellingRate)}%)`;
  resultDiv.style.display = 'block';
}

// リセット関数
function reset() {
  listPriceInput.value = '';
  discountRateInput.value = '';
  sellingRateInput.value = '';
  resultDiv.style.display = 'none';
}

// 設定を保存
function saveSettings() {
  const settings = {
    listPrice: listPriceInput.value,
    discountRate: discountRateInput.value,
    sellingRate: sellingRateInput.value
  };

  chrome.storage.local.set({ kakeriSettings: settings }, () => {
    alert('設定を保存しました');
  });
}

// 設定を読み込み
function loadSettings() {
  chrome.storage.local.get(['kakeriSettings'], (result) => {
    if (result.kakeriSettings) {
      const settings = result.kakeriSettings;
      listPriceInput.value = settings.listPrice || '';
      discountRateInput.value = settings.discountRate || '';
      sellingRateInput.value = settings.sellingRate || '';
      alert('設定を読み込みました');
    } else {
      alert('保存された設定がありません');
    }
  });
}

// 設定をクリア
function clearSettings() {
  if (confirm('保存された設定をクリアしますか？')) {
    chrome.storage.local.remove(['kakeriSettings'], () => {
      alert('設定をクリアしました');
    });
  }
}

// イベントリスナー
calculateBtn.addEventListener('click', calculate);
resetBtn.addEventListener('click', reset);
saveSettingsBtn.addEventListener('click', saveSettings);
loadSettingsBtn.addEventListener('click', loadSettings);
clearSettingsBtn.addEventListener('click', clearSettings);

// Enterキーで計算
listPriceInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') calculate();
});

// select要素が変更されたら自動計算
discountRateInput.addEventListener('change', () => {
  if (listPriceInput.value && sellingRateInput.value) {
    calculate();
  }
});
sellingRateInput.addEventListener('change', () => {
  if (listPriceInput.value && discountRateInput.value) {
    calculate();
  }
});

// ページ読み込み時に設定を自動読み込み
chrome.storage.local.get(['kakeriSettings'], (result) => {
  if (result.kakeriSettings) {
    const settings = result.kakeriSettings;
    if (settings.listPrice) listPriceInput.value = settings.listPrice;
    if (settings.discountRate) discountRateInput.value = settings.discountRate;
    if (settings.sellingRate) sellingRateInput.value = settings.sellingRate;
  }
});
