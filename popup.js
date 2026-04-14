// DOM要素
const listPriceInput = document.getElementById('listPrice');
const discountRateInput = document.getElementById('discountRate');
const discountRateCustomInput = document.getElementById('discountRateCustom');
const sellingRateInput = document.getElementById('sellingRate');
const sellingRateCustomInput = document.getElementById('sellingRateCustom');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultDiv = document.getElementById('result');
const basePriceSpan = document.getElementById('basePrice');
const sellingPriceSpan = document.getElementById('sellingPrice');
const rateButtons = document.querySelectorAll('.rate-btn');
const sellingRateButtons = document.querySelectorAll('.selling-rate-btn');
const copyButtons = document.querySelectorAll('.copy-btn');

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
    alert('掛け率を選択または入力してください');
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
    // 固定値（自由入力値、70% または 80%）
    sellingRate = parseFloat(sellingRateValue);
  }

  // 計算
  const basePrice = listPrice * discountRate; // 仕入れ価格
  const sellingPrice = listPrice * (sellingRate / 100); // 定価からのパーセンテージ

  // 結果を表示
  basePriceSpan.textContent = `¥${Math.round(basePrice).toLocaleString()}`;
  basePriceSpan.dataset.rawValue = Math.round(basePrice);
  sellingPriceSpan.textContent = `¥${Math.round(sellingPrice).toLocaleString()} (${Math.round(sellingRate)}%)`;
  sellingPriceSpan.dataset.rawValue = Math.round(sellingPrice);
  resultDiv.style.display = 'block';
}

// コピーボタンのイベントリスナー
copyButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const targetId = button.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    const value = targetElement.dataset.rawValue;

    if (value) {
      try {
        await navigator.clipboard.writeText(value.toString());
        const originalText = button.textContent;
        button.textContent = 'コピー完了!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      } catch (err) {
        // クリップボードAPIが失敗した場合のフォールバック
        const textArea = document.createElement('textarea');
        textArea.value = value.toString();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        const originalText = button.textContent;
        button.textContent = 'コピー完了!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }
    }
  });
});

// リセット関数
function reset() {
  listPriceInput.value = '';
  discountRateInput.value = '';
  discountRateCustomInput.value = '';
  sellingRateInput.value = '';
  sellingRateCustomInput.value = '';
  resultDiv.style.display = 'none';

  // ボタンのactive状態をリセット
  rateButtons.forEach(btn => btn.classList.remove('active'));
  sellingRateButtons.forEach(btn => btn.classList.remove('active'));
}

// 掛け率ボタンのイベントリスナー
rateButtons.forEach(button => {
  button.addEventListener('click', () => {
    const rate = button.getAttribute('data-rate');

    // 全てのボタンのactive状態をリセット
    rateButtons.forEach(btn => btn.classList.remove('active'));

    // クリックされたボタンをactiveに
    button.classList.add('active');

    // 隠しinputに値を設定
    discountRateInput.value = rate;

    // 自由入力欄をクリア
    discountRateCustomInput.value = '';

    // 自動計算
    if (listPriceInput.value && sellingRateInput.value) {
      calculate();
    }
  });
});

// 販売価格率ボタンのイベントリスナー
sellingRateButtons.forEach(button => {
  button.addEventListener('click', () => {
    const rate = button.getAttribute('data-rate');

    // 全てのボタンのactive状態をリセット
    sellingRateButtons.forEach(btn => btn.classList.remove('active'));

    // クリックされたボタンをactiveに
    button.classList.add('active');

    // 隠しinputに値を設定
    sellingRateInput.value = rate;

    // 自由入力欄をクリア
    sellingRateCustomInput.value = '';

    // 自動計算
    if (listPriceInput.value && discountRateInput.value) {
      calculate();
    }
  });
});

// 自由入力欄のイベントリスナー（掛け率）
discountRateCustomInput.addEventListener('input', () => {
  const value = parseFloat(discountRateCustomInput.value);

  // ボタンのactive状態をリセット
  rateButtons.forEach(btn => btn.classList.remove('active'));

  // 値を設定
  if (!isNaN(value) && value > 0 && value <= 1) {
    discountRateInput.value = value;

    // 自動計算
    if (listPriceInput.value && sellingRateInput.value) {
      calculate();
    }
  } else {
    discountRateInput.value = '';
  }
});

// 自由入力欄のイベントリスナー（販売価格率）
sellingRateCustomInput.addEventListener('input', () => {
  const value = parseFloat(sellingRateCustomInput.value);

  // ボタンのactive状態をリセット
  sellingRateButtons.forEach(btn => btn.classList.remove('active'));

  // 値を設定
  if (!isNaN(value) && value > 0 && value <= 100) {
    sellingRateInput.value = value;

    // 自動計算
    if (listPriceInput.value && discountRateInput.value) {
      calculate();
    }
  } else {
    sellingRateInput.value = '';
  }
});

// 設定を保存
function saveSettings() {
  const settings = {
    listPrice: listPriceInput.value,
    discountRate: discountRateInput.value,
    discountRateCustom: discountRateCustomInput.value,
    sellingRate: sellingRateInput.value,
    sellingRateCustom: sellingRateCustomInput.value
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

      // 掛け率の設定
      if (settings.discountRateCustom) {
        // 自由入力値が優先
        discountRateCustomInput.value = settings.discountRateCustom;
        discountRateInput.value = settings.discountRate;
        rateButtons.forEach(btn => btn.classList.remove('active'));
      } else if (settings.discountRate) {
        // ボタン選択
        discountRateInput.value = settings.discountRate;
        discountRateCustomInput.value = '';
        rateButtons.forEach(btn => {
          if (btn.getAttribute('data-rate') === settings.discountRate) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // 販売価格率の設定
      if (settings.sellingRateCustom) {
        // 自由入力値が優先
        sellingRateCustomInput.value = settings.sellingRateCustom;
        sellingRateInput.value = settings.sellingRate;
        sellingRateButtons.forEach(btn => btn.classList.remove('active'));
      } else if (settings.sellingRate) {
        // ボタン選択
        sellingRateInput.value = settings.sellingRate;
        sellingRateCustomInput.value = '';
        sellingRateButtons.forEach(btn => {
          if (btn.getAttribute('data-rate') === settings.sellingRate) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

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
discountRateCustomInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') calculate();
});
sellingRateCustomInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') calculate();
});

// 販売価格率selectが変更されたら自動計算
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

    // 掛け率の設定
    if (settings.discountRateCustom) {
      discountRateCustomInput.value = settings.discountRateCustom;
      discountRateInput.value = settings.discountRate;
    } else if (settings.discountRate) {
      discountRateInput.value = settings.discountRate;
      rateButtons.forEach(btn => {
        if (btn.getAttribute('data-rate') === settings.discountRate) {
          btn.classList.add('active');
        }
      });
    }

    // 販売価格率の設定
    if (settings.sellingRateCustom) {
      sellingRateCustomInput.value = settings.sellingRateCustom;
      sellingRateInput.value = settings.sellingRate;
    } else if (settings.sellingRate) {
      sellingRateInput.value = settings.sellingRate;
      sellingRateButtons.forEach(btn => {
        if (btn.getAttribute('data-rate') === settings.sellingRate) {
          btn.classList.add('active');
        }
      });
    }
  }
});
