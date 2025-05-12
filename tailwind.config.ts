/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // コンポーネントが配置されているディレクトリを指定
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}', // shadcn/uiのコンポーネントを含める
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};