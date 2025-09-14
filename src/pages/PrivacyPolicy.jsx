import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">سياسة الخصوصية</h1>
      <p className="mb-4">
        نحن نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. هذه السياسة توضح كيف
        نجمع ونستخدم ونحفظ البيانات التي تقدمها لنا من خلال متجرنا.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        المعلومات التي نجمعها:
      </h2>
      <ul className="list-disc list-inside">
        <li>الاسم والبريد الإلكتروني وبيانات التواصل</li>
        <li>معلومات الطلبات والتفضيلات</li>
        <li>بيانات الاستخدام والتصفح داخل الموقع</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">كيف نستخدم المعلومات:</h2>
      <ul className="list-disc list-inside">
        <li>لتنفيذ الطلبات وتحسين تجربة التسوق</li>
        <li>للتواصل معك بشأن المنتجات أو العروض</li>
        <li>لتحسين أداء المتجر وتحليل التفاعل</li>
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        باستخدامك هذا الموقع فإنك توافق على هذه السياسة. نحتفظ بحق تعديلها في أي
        وقت.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
