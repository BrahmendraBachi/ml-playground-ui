/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                primary: 'black',
                secondary: 'white',
            },
            fontFamily: {
                serif: ['serif'],
            },
            fontSize: {
                '2xl': '12.5rem',
            },
        },
    },
    plugins: [],
};
