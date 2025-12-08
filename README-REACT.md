# CineBook - Theatre Booking System (React + Vite)

تم تحويل المشروع بنجاح من Next.js إلى React مع React Router DOM! 🎉

## التقنيات المستخدمة

- ⚛️ React 18
- 🚀 Vite (بدلاً من Next.js)
- 🧭 React Router DOM v6 (للتنقل بين الصفحات)
- 🎨 Tailwind CSS v4
- 🔄 Redux Toolkit (لإدارة الحالة)
- 🗄️ JSON Server (قاعدة بيانات وهمية)
- 🎭 Framer Motion (للحركات)
- 🧩 Shadcn/UI Components

## كيفية تشغيل المشروع

### 1. تثبيت الحزم المطلوبة

```bash
npm install
```

### 2. تشغيل JSON Server (قاعدة البيانات الوهمية)

في نافذة terminal منفصلة:

```bash
npm run server
```

سيعمل JSON Server على المنفذ `http://localhost:5000`

### 3. تشغيل تطبيق React مع Vite

في نافذة terminal أخرى:

```bash
npm run dev
```

سيعمل التطبيق على المنفذ `http://localhost:3000`

## الملفات الرئيسية

### هيكل المشروع الجديد

```
project/
├── index.html              # نقطة الدخول الرئيسية
├── vite.config.js          # إعدادات Vite
├── db.json                 # قاعدة البيانات الوهمية
├── src/
│   ├── main.jsx            # نقطة دخول React
│   ├── App.jsx             # المكون الرئيسي مع React Router
│   ├── components/         # المكونات القابلة لإعادة الاستخدام
│   │   ├── Header.jsx      # رأس الصفحة (محول)
│   │   ├── Footer.jsx      # تذييل الصفحة (محول)
│   │   └── ui/             # مكونات Shadcn UI
│   ├── pages/              # صفحات التطبيق (NEW!)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── MovieDetailsPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   └── ...
│   ├── hooks/              # React Hooks المخصصة
│   │   └── useAuth.jsx     # نظام المصادقة البسيط (NEW!)
│   ├── store/              # Redux Store
│   │   ├── store.js
│   │   └── slices/
│   └── app/
│       └── globals.css     # الأنماط العامة
```

## التغييرات الرئيسية من Next.js

### 1. التنقل

**قبل (Next.js):**
```jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/movies">Movies</Link>
const router = useRouter();
router.push('/login');
```

**بعد (React Router):**
```jsx
import { Link, useNavigate } from 'react-router-dom';

<Link to="/movies">Movies</Link>
const navigate = useNavigate();
navigate('/login');
```

### 2. المعاملات من الروابط (URL Parameters)

**قبل (Next.js):**
```jsx
import { useParams } from 'next/navigation';
const params = useParams();
const id = params.id;
```

**بعد (React Router):**
```jsx
import { useParams } from 'react-router-dom';
const { id } = useParams();
```

### 3. استعلامات البحث (Search Params)

**قبل (Next.js):**
```jsx
import { useSearchParams } from 'next/navigation';
const searchParams = useSearchParams();
const search = searchParams.get('search');
```

**بعد (React Router):**
```jsx
import { useSearchParams } from 'react-router-dom';
const [searchParams] = useSearchParams();
const search = searchParams.get('search');
```

### 4. الصور

**قبل (Next.js):**
```jsx
import Image from 'next/image';
<Image src="/movie.jpg" alt="Movie" fill />
```

**بعد (React):**
```jsx
<img src="/movie.jpg" alt="Movie" className="w-full h-full object-cover" />
```

## نظام المصادقة

تم إنشاء نظام مصادقة بسيط باستخدام Context API:

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, register } = useAuth();
  
  // تسجيل الدخول
  const result = await login(email, password);
  
  // تسجيل مستخدم جديد
  const result = await register(name, email, password);
  
  // تسجيل الخروج
  logout();
}
```

## البيانات الوهمية

### المستخدمون الافتراضيون في `db.json`:

```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

### الأفلام، المواعيد، المقاعد، والطعام متوفرة أيضاً!

## السكريبتات المتاحة

- `npm run dev` - تشغيل تطبيق React مع Vite
- `npm run build` - بناء التطبيق للإنتاج
- `npm run preview` - معاينة النسخة المبنية
- `npm run server` - تشغيل JSON Server

## الميزات المتوفرة

✅ الصفحة الرئيسية مع عرض الأفلام  
✅ تصفية الأفلام حسب النوع  
✅ البحث عن الأفلام  
✅ صفحة تفاصيل الفيلم  
✅ عرض المواعيد المتاحة  
✅ تسجيل الدخول والتسجيل  
✅ نظام المصادقة  
✅ عربة التسوق (Redux)  
✅ صفحة الحجوزات  
✅ التنقل السلس مع React Router  

## ملاحظات مهمة

1. **لا تحتاج Next.js بعد الآن** - تم استبداله بالكامل بـ Vite
2. **استخدم `npm run dev` بدلاً من `next dev`**
3. **جميع المسارات تعمل من جانب العميل (Client-Side)**
4. **لا حاجة لـ "use client" directive**
5. **JSON Server يعمل كـ API backend بسيط**

## المشاكل المحتملة وحلولها

### المشكلة: الأخطاء المتعلقة بـ Next.js لا تزال تظهر
**الحل:** تأكد من إيقاف خادم Next.js وتشغيل Vite بدلاً منه.

### المشكلة: لا يمكن الوصول إلى البيانات
**الحل:** تأكد من تشغيل JSON Server على المنفذ 5000.

### المشكلة: التنقل لا يعمل
**الحل:** استخدم `<Link to="...">` من `react-router-dom` بدلاً من `<Link href="...">` من Next.js.

## التطوير المستقبلي

يمكنك الآن تطوير التطبيق باستخدام:
- React عادي بدون قيود Next.js
- React Router DOM للتوجيه
- Redux Toolkit لإدارة الحالة
- JSON Server أو أي backend آخر

---

**استمتع بالتطوير! 🚀**
