/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
    images: {
        domains: ['starwars-visualguide.com'],
    },
    basePath: isProd ? "/starwars" : "",
    trailingSlash: true,
    output: 'export', // Asegúrate de tener esta línea
}

export default nextConfig