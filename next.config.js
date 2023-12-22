/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// async redirects() {
//   return [
//     {
//       source: "/dashboard/events/_modal",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/admin/unit_handling/_addModal",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/admin/unit_handling/_updateModal",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_addDataPoint",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_context",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_dataTable",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_metricToolbar",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_renderer",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_scatterPlotView",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_statisticsBoard",
//       destination: "/404",
//       permanent: true,
//     },
//     {
//       source: "/dashboard/unit/:id/metrics/_toolbar",
//       destination: "/404",
//       permanent: true,
//     },
//   ];
// },