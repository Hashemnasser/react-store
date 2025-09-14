// src/components/SalesChart.jsx
export default function SimpleSalesChart({ data }) {
  // data = [{ day: "Mon", sales: 5 }, { day: "Tue", sales: 10 }, ...]
  const maxSales = Math.max(...data.map((d) => d.sales));
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow w-full my-5">
      <h2 className="font-bold mb-4 text-gray-800 dark:text-gray-100">
        Sales Last 7 Days
      </h2>
      <div className="flex  gap-2 h-40">
        {data.map((d) => (
          <div
            key={d.day}
            className="flex flex-col justify-end items-center w-6 h-full col">
            <div
              className="bg-blue-500 w-full rounded-t"
              style={{ height: `${(d.sales / maxSales) * 100}%` }}
            />
            <span className="text-xs mt-1 text-gray-700 dark:text-gray-200">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
