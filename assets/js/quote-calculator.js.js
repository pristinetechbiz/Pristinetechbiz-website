/* =========================================================================
   PristineTech Biz — Electrical Wiring Quotation Calculator
   -------------------------------------------------------------------------
   HOW THIS WORKS (read this before editing):
   1. FLAT_PROFILES below lists each flat size and roughly how many of each
      material item that size typically needs. These quantities are
      PLACEHOLDER ESTIMATES — adjust them to match how you actually scope
      a job (e.g. how many sockets you'd realistically install in a
      2-bedroom flat).
   2. UNIT_PRICES lists your cost per unit for each material, in Naira.
      These are PLACEHOLDERS TOO — replace every number with your real
      supplier cost.
   3. The math (do not need to touch this part):
         materialCost = sum(quantity x unit price) for every item
         laborCost    = materialCost x 0.30      (labor pegged at 30%)
         subtotal     = materialCost + laborCost
         finalTotal   = subtotal x 1.03           (3% market fluctuation)
   ========================================================================= */

const UNIT_PRICES = {
  socket:            2500,   // per 13A socket outlet, installed
  switch:            2000,   // per light switch point
  lightingPoint:     3000,   // per ceiling/wall lighting point wired
  distributionBoard: 45000,  // per consumer/distribution board, installed
  cableMeter:        800,    // per meter of wiring cable
  breaker:           6500,   // per circuit breaker
};

const FLAT_PROFILES = {
  "self-contain": {
    label: "Self-Contain / Studio",
    quantities: { socket: 6,  switch: 4,  lightingPoint: 4,  distributionBoard: 1, cableMeter: 60,  breaker: 4  }
  },
  "1-bedroom": {
    label: "1 Bedroom Flat",
    quantities: { socket: 10, switch: 6,  lightingPoint: 6,  distributionBoard: 1, cableMeter: 100, breaker: 6  }
  },
  "2-bedroom": {
    label: "2 Bedroom Flat",
    quantities: { socket: 16, switch: 10, lightingPoint: 10, distributionBoard: 1, cableMeter: 160, breaker: 8  }
  },
  "3-bedroom": {
    label: "3 Bedroom Flat",
    quantities: { socket: 22, switch: 14, lightingPoint: 14, distributionBoard: 1, cableMeter: 220, breaker: 10 }
  },
  "4-bedroom-duplex": {
    label: "4 Bedroom Duplex",
    quantities: { socket: 30, switch: 20, lightingPoint: 20, distributionBoard: 2, cableMeter: 320, breaker: 14 }
  },
};

const LABOR_RATE = 0.30;      // labor pegged at 30% of material cost
const MARKET_MARKUP = 1.03;   // 3% market fluctuation adjustment

const ITEM_LABELS = {
  socket: "13A Sockets",
  switch: "Light Switches",
  lightingPoint: "Lighting Points",
  distributionBoard: "Distribution Board",
  cableMeter: "Wiring Cable (meters)",
  breaker: "Circuit Breakers",
};

function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

function calculateQuote(flatKey) {
  const profile = FLAT_PROFILES[flatKey];
  if (!profile) return null;

  const lineItems = [];
  let materialCost = 0;

  Object.entries(profile.quantities).forEach(([item, qty]) => {
    const unitPrice = UNIT_PRICES[item];
    const lineTotal = qty * unitPrice;
    materialCost += lineTotal;
    lineItems.push({ label: ITEM_LABELS[item], qty, unitPrice, lineTotal });
  });

  const laborCost = materialCost * LABOR_RATE;
  const subtotal = materialCost + laborCost;
  const finalTotal = subtotal * MARKET_MARKUP;

  return { flatLabel: profile.label, lineItems, materialCost, laborCost, subtotal, finalTotal };
}

function renderQuote(flatKey) {
  const result = calculateQuote(flatKey);
  const box = document.getElementById("quote-result");
  if (!result || !box) return;

  let rowsHtml = result.lineItems.map(li => `
    <tr>
      <td>${li.label}</td>
      <td>${li.qty}</td>
      <td>${formatNaira(li.unitPrice)}</td>
      <td>${formatNaira(li.lineTotal)}</td>
    </tr>
  `).join("");

  box.innerHTML = `
    <h3 class="quote-title">${result.flatLabel} — Estimated Wiring Quote</h3>
    <div class="quote-table-wrap">
      <table class="quote-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
    <div class="quote-summary">
      <div><span>Material cost</span><span>${formatNaira(result.materialCost)}</span></div>
      <div><span>Labor (30% of materials)</span><span>${formatNaira(result.laborCost)}</span></div>
      <div><span>Subtotal</span><span>${formatNaira(result.subtotal)}</span></div>
      <div><span>Market adjustment (3%)</span><span>${formatNaira(result.finalTotal - result.subtotal)}</span></div>
      <div class="quote-final"><span>Estimated Total</span><span>${formatNaira(result.finalTotal)}</span></div>
    </div>
    <p class="quote-disclaimer">This is an automated estimate based on typical wiring scope for this flat size. Final pricing may vary after a site visit.</p>
    <a class="btn btn-solid" id="quote-whatsapp-btn" target="_blank" rel="noopener">Request formal quote on WhatsApp →</a>
  `;

  const waMessage = encodeURIComponent(
    `Hi PristineTech Biz, I got an estimated wiring quote of ${formatNaira(result.finalTotal)} for a ${result.flatLabel} on your website. I'd like to confirm this with a site visit.`
  );
  document.getElementById("quote-whatsapp-btn").href = `https://wa.me/2347010302625?text=${waMessage}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const flatKey = document.getElementById("flat-size-select").value;
    renderQuote(flatKey);
    document.getElementById("quote-result").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
