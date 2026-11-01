// import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
// import Hero from "./Section/Hero";
// import Categories from "./Section/Categories";
// import { useQuery } from "@tanstack/react-query";
// import { api_url } from "../api/authApi";
// import {
//   FiCalendar,
//   FiMapPin,
//   FiDollarSign,
//   FiUsers,
//   FiStar,
//   FiCheckCircle,
//   FiClock,
//   FiShield,
//   FiHeart,
//   FiBookOpen,
//   FiHome,
//   FiCoffee,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import InstallButton from "../components/InstallButton";

// // Lazy load non-critical sections
// const IslamicBooksSection = lazy(() => import("./Section/IslamicBooksSection"));
// const PopularBooksSection = lazy(() => import("./Section/PopularBooksSection"));
// const BookServiceH = lazy(() => import("./Section/BookServiceH"));
// const ShopSection = lazy(() => import("./Section/ShopSection"));
// const TrustSection = lazy(() => import("./Section/TrustSection"));
// const DynamicPageSections = lazy(() => import("./Section/DynamicPageSections"));

// // Loading skeleton component
// const SectionSkeleton = ({ height = "h-64", className = "" }) => (
//   <div
//     className={`animate-pulse bg-gray-200 rounded-lg ${height} mx-auto mb-8 ${className}`}
//   >
//     <div className="flex items-center justify-center h-full">
//       <div className="text-gray-400">Loading...</div>
//     </div>
//   </div>
// );

// // Custom hook for intersection observer
// const useIntersectionObserver = (callback, options = {}) => {
//   useEffect(() => {
//     const observerOptions = {
//       root: null,
//       rootMargin: "100px",
//       threshold: 0.1,
//       ...options,
//     };

//     const observer = new IntersectionObserver(callback, observerOptions);

//     const triggers = document.querySelectorAll("[data-section]");
//     triggers.forEach((trigger) => observer.observe(trigger));

//     return () => observer.disconnect();
//   }, [callback, options]);
// };

// // Custom hook for API calls with caching
// const useApiQuery = (endpoint, queryKey, enabled = true) => {
//   return useQuery({
//     queryKey: [queryKey],
//     queryFn: () => fetch(`${api_url}${endpoint}`).then((res) => res.json()),
//     enabled,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//     retry: 2,
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//   });
// };

// const item = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0 },
// };

// const hoverEffect = {
//   scale: 1.03,
//   boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
// };

// // Animation variants
// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const bg = [
//   {
//     sbg: "bg-gradient-to-r from-green-50 to-emerald-50 py-12",
//   },
//   {
//     sbg: "bg-white py-12",
//   },
//   {
//     sbg: "bg-gradient-to-r from-blue-50 to-indigo-50 py-12",
//   },
// ];

// const Home = () => {
//   const [visibleSections, setVisibleSections] = useState({
//     hero: true,
//     islamic: true,
//     popular: false,
//     kafela: false,
//     categories: false,
//     travel: false,
//     medical: false,
//     education: false,
//     service: false,
//     shop: false,
//     trust: false,
//   });

//   // Critical above-the-fold data
//   const {
//     isLoading: slidersLoading,
//     error: slidersError,
//     data: slidersData,
//   } = useApiQuery("sliders", "sliders");

//   const {
//     isLoading: loading,
//     kafelaError,
//     data: kafela,
//   } = useApiQuery("kfela", "kfela");
//   // console.log(kafela);

//   const {
//     isLoading: islamicLoading,
//     error: islamicError,
//     data: islamicData,
//   } = useApiQuery("islamic-books", "islamic-books");
//   const extraCategories = [
//     { id: "", name: "ভ্রমণ", path: "/travel" },
//     { id: "", name: "বিদেশে উচ্চশিক্ষা", path: "/higher-education" },
//     { id: "", name: "মেডিক্যাল কেয়ার", path: "/medical-care" },
//   ];

//   // Lazy loaded sections data
//   const {
//     isLoading: categoriesLoading,
//     error: categoriesError,
//     data: categoriesData,
//   } = useApiQuery(
//     "popular-category",
//     "popular-category",
//     visibleSections.categories,
//   );
//   // console.log(categoriesData);
//   const mergedCategories = React.useMemo(() => {
//     if (!Array.isArray(categoriesData?.data)) return extraCategories;

//     return [...categoriesData?.data, ...extraCategories];
//   }, [categoriesData]);

//   const {
//     isLoading: popularLoading,
//     error: popularError,
//     data: popularData,
//   } = useApiQuery("popular-books", "popular-books", visibleSections.popular);

//   const {
//     isLoading: bookSectionsLoading,
//     error: bookSectionsError,
//     data: bookSectionsData,
//   } = useApiQuery("book-sections", "book-sections", visibleSections.service);

//   const {
//     isLoading: sunnahShopLoading,
//     error: sunnahShopError,
//     data: sunnahShopData,
//   } = useApiQuery("sunnah-shop", "sunnah-shop", visibleSections.shop);

//   const {
//     isLoading: thajjUmrahLoading,
//     error: thajjUmrahError,
//     data: thajjUmrahData,
//   } = useApiQuery("page/hajj-umrah", "hajj-umrah", visibleSections.kafela);
//   const {
//     isLoading: travelLoading,
//     error: travelError,
//     data: travelData,
//   } = useApiQuery("page/travel", "travel", visibleSections.travel);

//   // console.log(travelData);

//   const {
//     isLoading: medicalLoading,
//     error: medicalError,
//     data: medicalData,
//   } = useApiQuery("page/medical-care", "medical-care", visibleSections.medical);

//   const {
//     isLoading: educationLoading,
//     error: educationError,
//     data: educationData,
//   } = useApiQuery(
//     "page/higher-education",
//     "higher-education",
//     visibleSections.education,
//   );

//   // Intersection Observer callback
//   const handleIntersection = useMemo(
//     () => (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const sectionName = entry.target.dataset.section;
//           if (sectionName && !visibleSections[sectionName]) {
//             setVisibleSections((prev) => ({ ...prev, [sectionName]: true }));
//           }
//         }
//       });
//     },
//     [visibleSections],
//   );

//   // Setup intersection observer
//   useIntersectionObserver(handleIntersection);

//   // Memoized sections
//   const heroSection = useMemo(
//     () => (
//       <Hero
//         data={slidersData?.data}
//         loading={slidersLoading}
//         error={slidersError}
//       />
//     ),
//     [slidersData?.data, slidersLoading, slidersError],
//   );

//   const categoriesSection = useMemo(
//     () => (
//       <Categories
//         data={mergedCategories}
//         loading={categoriesLoading}
//         error={categoriesError}
//       />
//     ),
//     [mergedCategories, categoriesLoading, categoriesError],
//   );

//   // Error boundary for sections
//   const SectionErrorBoundary = ({ error, children }) => {
//     if (error) {
//       return (
//         <div className="text-center py-8 text-red-500">
//           <p>Failed to load this section. Please try again later.</p>
//         </div>
//       );
//     }
//     return children;
//   };

//   // Show loading state while critical data loads
//   if (slidersLoading || categoriesLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3AB549] mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading content...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state if critical APIs fail
//   if (slidersError || categoriesError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-red-600">
//           <svg
//             className="w-16 h-16 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//             />
//           </svg>
//           <p className="text-lg mb-2">Something went wrong</p>
//           <p className="text-sm text-gray-500">
//             Please try refreshing the page
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Critical above-the-fold content */}
//       {heroSection}
//       <div data-section="islamic" className="min-h-[1px]" aria-hidden="true" />
//       {visibleSections.islamic && (
//         <SectionErrorBoundary error={islamicError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <IslamicBooksSection
//               data={islamicData?.data}
//               loading={islamicLoading}
//               error={islamicError}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="popular" className="min-h-[1px]" aria-hidden="true" />

//       {visibleSections.popular && (
//         <SectionErrorBoundary error={popularError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <PopularBooksSection
//               data={popularData?.data}
//               loading={popularLoading}
//               error={popularError}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="kafela" className="min-h-[1px]" aria-hidden="true" />
//       {/* {visibleSections.kafela && (
//                 <SectionErrorBoundary error={kafelaError}>
//                     <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//                         {kafela?.packageTypes.map((type, index) => {
//                             const background = bg[index % bg.length].sbg;
//                             if (type.packages?.length == 0) {
//                                 return null;
//                             }

//                             return (
//                                 <div className={background} key={index}>
//                                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 20 }}
//                                             whileInView={{ opacity: 1, y: 0 }}
//                                             transition={{ duration: 0.5 }}
//                                             viewport={{ once: true }}
//                                             className="text-center mb-12"
//                                         >
//                                             <h2 className="text-3xl font-bold text-gray-900 mb-2">{type.name}</h2>
//                                             <div className="w-20 h-1 bg-green-600 mx-auto"></div>
//                                         </motion.div>

//                                         <motion.div
//                                             variants={container}
//                                             initial="hidden"
//                                             whileInView="show"
//                                             viewport={{ once: true }}
//                                             className="grid grid-cols-1 md:grid-cols-3 gap-8"
//                                         >
//                                             {type?.packages.map((pkg, index) => (
//                                                 <motion.div
//                                                     key={pkg.id}
//                                                     variants={item}
//                                                     whileHover={hoverEffect}
//                                                     className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${pkg.star ? "border-2 border-green-500" : ""}`}
//                                                 >
//                                                     <div className="p-6">
//                                                         <div className="flex justify-between items-start mb-4">
//                                                             <h3 className="text-xl font-bold">{pkg.name}</h3>
//                                                             {pkg.star && <FiStar className="w-5 h-5 text-yellow-500" />}
//                                                         </div>
//                                                         <div className="flex items-center text-gray-600 mb-4">
//                                                             <FiCalendar className="mr-2" />
//                                                             <span>{pkg.days}</span>
//                                                         </div>
//                                                         <div className="flex items-center text-gray-800 font-bold mb-6">
//                                                             <span className="text-2xl">{pkg.price}</span>
//                                                             <h1 className="text-2xl ml-2">
//                                                                 ৳
//                                                                 </h1>
//                                                         </div>
//                                                         <ul className="space-y-3 mb-6">
//                                                             {pkg?.package_details.map((feature, i) => (
//                                                                 <motion.li
//                                                                     key={i}
//                                                                     className="flex items-start"
//                                                                     whileHover={{ x: 5 }}
//                                                                 >
//                                                                     <FiCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                                                                     <span>{feature.name}</span>
//                                                                 </motion.li>
//                                                             ))}
//                                                         </ul>
//                                                         <Link
//                                                             to="/contact"
//                                                             className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
//                                                         >
//                                                             বুকিং করুন
//                                                         </Link>
//                                                     </div>
//                                                 </motion.div>
//                                             ))}
//                                         </motion.div>
//                                     </div>
//                                 </div>

//                             )
//                         }
//                         )}
//                     </Suspense>
//                 </SectionErrorBoundary>
//             )} */}

//       {visibleSections.kafela && (
//         <SectionErrorBoundary error={thajjUmrahError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <DynamicPageSections
//               data={thajjUmrahData}
//               loading={thajjUmrahLoading}
//               error={thajjUmrahError}
//               page_url={"hajj-umrah"}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div
//         data-section="categories"
//         className="min-h-[1px]"
//         aria-hidden="true"
//       />
//       {categoriesSection}

//       {/* Intersection observer triggers and lazy loaded sections */}

//       <div data-section="service" className="min-h-[1px]" aria-hidden="true" />
//       {visibleSections.service && (
//         <SectionErrorBoundary error={bookSectionsError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <BookServiceH
//               data={bookSectionsData?.data}
//               loading={bookSectionsLoading}
//               error={bookSectionsError}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="medical" className="min-h-[1px]" aria-hidden="true" />

//       {visibleSections.medical && (
//         <SectionErrorBoundary error={medicalError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <DynamicPageSections
//               data={medicalData}
//               loading={medicalLoading}
//               error={medicalError}
//               page_url={"medical-care"}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}
//       <div
//         data-section="education"
//         className="min-h-[1px]"
//         aria-hidden="true"
//       />

//       {visibleSections.education && (
//         <SectionErrorBoundary error={educationError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <DynamicPageSections
//               data={educationData}
//               loading={educationLoading}
//               error={educationError}
//               page_url={"higher-education"}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="travel" className="min-h-[1px]" aria-hidden="true" />

//       {visibleSections.travel && (
//         <SectionErrorBoundary error={travelError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <DynamicPageSections
//               data={travelData}
//               loading={travelLoading}
//               error={travelError}
//               page_url={"travel"}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="shop" className="min-h-[1px]" aria-hidden="true" />
//       {visibleSections.shop && (
//         <SectionErrorBoundary error={sunnahShopError}>
//           <Suspense fallback={<SectionSkeleton className="max-w-7xl" />}>
//             <ShopSection
//               data={sunnahShopData?.data}
//               loading={sunnahShopLoading}
//               error={sunnahShopError}
//             />
//           </Suspense>
//         </SectionErrorBoundary>
//       )}

//       <div data-section="trust" className="min-h-[1px]" aria-hidden="true" />
//       {visibleSections.trust && (
//         <Suspense
//           fallback={<SectionSkeleton height="h-32" className="max-w-7xl" />}
//         >
//           <TrustSection
//             data={{}} // Trust section might not need API data
//             loading={false}
//             error={null}
//           />
//         </Suspense>
//       )}
//       <InstallButton />
//     </div>
//   );
// };

// export default Home;
