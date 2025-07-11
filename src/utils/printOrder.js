export const printOrder = (order) => {
  const win = window.open("", "_blank");
  if (!win) return alert("Popup blocked");

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr class="border-b">
        <td class="py-2 px-3">${item.name}</td>
        <td class="py-2 px-3 text-center">${item.quantity}</td>
        <td class="py-2 px-3 text-right">$${item.price.toFixed(2)}</td>
        <td class="py-2 px-3 text-right">$${(
          item.quantity * item.price
        ).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  win.document.write(`
    <html>
      <head>
        <title>Order ${order.id}</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background-color: white;
            color: #1f2937;
            padding: 24px;
          }

          h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th {
            background-color: #f9fafb;
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 600;
            font-size: 14px;
            color: #374151;
          }

          td {
            padding: 10px 12px;
            font-size: 14px;
            color: #374151;
          }

          tr.border-b {
            border-bottom: 1px solid #e5e7eb;
          }

          .total {
            margin-top: 24px;
            text-align: right;
            font-weight: 700;
            font-size: 16px;
            color: #111827;
          }

          .dark {
            background-color: #1f2937;
            color: #f9fafb;
          }

          .dark th {
            background-color: #374151;
            color: #f9fafb;
          }

          .dark td {
            color: #f3f4f6;
          }

          .dark .total {
            color: #f9fafb;
          }
        </style>
      </head>
      <body class="${
        document.documentElement.classList.contains("dark") ? "dark" : ""
      }">
        <h1>Order Receipt</h1>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p class="total">Total: $${total.toFixed(2)}</p>

        <script>
          window.onload = function () {
            window.print();
          }
        </script>
      </body>
    </html>
  `);

  win.document.close();
};
