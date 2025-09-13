module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
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
