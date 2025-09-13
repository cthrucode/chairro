module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ebnledcbmnsnwsaremnk.supabase.co",
        pathname: "/storage/v1/object/public/listing-images/**",
      },
    ],
  },
};
