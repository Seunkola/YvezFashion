@echo off
echo Creating folder and file structure...

:: Create app directory structure
mkdir app\shop
mkdir app\product\[id]
mkdir app\cart
mkdir app\checkout
mkdir app\profile
mkdir app\login
mkdir app\register
mkdir app\admin

:: Create components
mkdir components
mkdir components\layout
mkdir components\ui

:: Create features
mkdir features
mkdir features\auth
mkdir features\cart
mkdir features\product

:: Create context
mkdir context

:: Create hooks
mkdir hooks

:: Create lib
mkdir lib
mkdir lib\supabase
mkdir lib\stripe

:: Create types
mkdir types

:: Create styles
mkdir styles

:: Create public assets folder
mkdir public
mkdir public\images

:: Create files
echo // Shop > app\shop\page.tsx
echo // Product Detail > app\product\[id]\page.tsx
echo // Cart > app\cart\page.tsx
echo // Checkout > app\checkout\page.tsx
echo // Profile > app\profile\page.tsx
echo // Login > app\login\page.tsx
echo // Register > app\register\page.tsx
echo // Admin Dashboard > app\admin\page.tsx

echo // Navbar > components\layout\Navbar.tsx
echo // Footer > components\layout\Footer.tsx
echo // Container > components\layout\Container.tsx

echo // Button > components\ui\Button.tsx
echo // Input > components\ui\Input.tsx
echo // Select > components\ui\Select.tsx
echo // Badge > components\ui\Badge.tsx
echo // Loader > components\ui\Loader.tsx
echo // ProductCard > components\ui\ProductCard.tsx

echo // Auth Service > features\auth\auth.service.ts
echo // Auth Hook > features\auth\useAuth.ts
echo // Auth Types > features\auth\auth.types.ts

echo // Cart Reducer > features\cart\cartReducer.ts
echo // Cart Utils > features\cart\cartUtils.ts
echo // Cart Types > features\cart\cart.types.ts

echo // Product Service > features\product\product.service.ts
echo // Product Hook > features\product\useProducts.ts
echo // Product Types > features\product\product.types.ts

echo // Auth Context > context\AuthContext.tsx
echo // Cart Context > context\CartContext.tsx

echo // useMounted > hooks\useMounted.ts
echo // useDebounce > hooks\useDebounce.ts

echo // Supabase Client > lib\supabase\client.ts
echo // Stripe Config > lib\stripe\stripe.ts

echo // Cart Types > types\cart.d.ts
echo // Product Types > types\product.d.ts
echo // User Types > types\user.d.ts

echo /* Global Styles */ > styles\globals.css
echo <!-- Logo Placeholder --> > public\images\logo.svg

echo ENV= > .env.local
echo ENV= > .env.example
echo node_modules/ > .gitignore
echo # Fashion E-commerce App > README.md

echo ✅ Folder structure and stubs created successfully!
pause
