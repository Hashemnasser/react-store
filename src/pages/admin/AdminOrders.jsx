import { useEffect, useState } from "react";
import { getAllOrders } from "@/api/orders"; // دالة لجلب كل الطلبات
//import { getAllUsers } from "@/api/users"; // دالة لجلب كل المستخدمين
import { Card, CardContent } from "@/components/ui/card"; // مكونات الكارد لتصميم العرض
import { Loader } from "@/components/Loader"; // مكون عرض تحميل
import { toast } from "react-hot-toast"; // مكتبة لإظهار الإشعارات
import { formatDate } from "@/lib/utils"; // دالة لتنسيق التاريخ

const AdminOrders = () => {
  // الحالة لتخزين الطلبات
  const [orders, setOrders] = useState([]);
  // الحالة لتخزين المستخدمين
  const [users, setUsers] = useState([]);
  // حالة تحميل البيانات
  const [loading, setLoading] = useState(true);

  // دالة لجلب البيانات من السيرفر
  const fetchData = async () => {
    try {
      // جلب الطلبات والمستخدمين بشكل متوازي
      const [ordersRes, usersRes] = await Promise.all([
        getAllOrders(),
        //getAllUsers(),
      ]);
      // تخزين الطلبات بعد عكس الترتيب (الأحدث أولاً)
      setOrders(ordersRes.reverse());
      // تخزين المستخدمين
      setUsers(usersRes);
    } catch (error) {
      toast.error("Failed to fetch orders or users.");
    } finally {
      setLoading(false);
    }
  };

  // دالة للحصول على اسم المستخدم من معرفه
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  // تنفيذ جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchData();
  }, []);

  // إذا كانت البيانات ما زالت تحمل، عرض مكون التحميل
  if (loading) return <Loader />;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="shadow-md">
            <CardContent className="space-y-2 p-4">
              <div className="flex justify-between">
                <span className="font-semibold">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User:</span>
                <span>{getUserName(order.userId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{formatDate(order.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Items:</span>
                <span>{order.items.length}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
