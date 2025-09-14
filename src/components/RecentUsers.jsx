// src/components/RecentUsers.jsx
export default function RecentUsers({ users }) {
  const latestUsers = users.slice(-5).reverse(); // آخر 5 مستخدمين

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow w-full mt-4">
      <h2 className="font-bold mb-4 text-gray-800 dark:text-gray-100">
        Recent Users
      </h2>
      <ul className="space-y-2">
        {latestUsers.map((user) => (
          <li
            key={user.id}
            className="flex justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span>{user.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {user.email}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
