/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
    images: {
        domains: ['starwars-visualguide.com'],
        unoptimized: true, // Disable Image Optimization API
    },
    basePath: isProd ? "/starwars" : "",
    trailingSlash: true,
    output: 'export', // Ensure this line is present
}

export default nextConfig