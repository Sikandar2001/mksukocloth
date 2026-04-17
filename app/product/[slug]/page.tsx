'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';

export default function ProductDetailPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try fetching by slug first
        let q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
        let snapshot = await getDocs(q);
        
        // Fallback to fetching by document ID if slug doesn't match
        if (snapshot.empty) {
          const docRef = doc(db, "products", slug as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const productData = docSnap.data();
            setProductData(productData, docSnap.id);
            return;
          }
        } else {
          const productData = snapshot.docs[0].data();
          setProductData(productData, snapshot.docs[0].id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const setProductData = (productData: any, id: string) => {
      const colors = productData.colors || [];
      const initialColor = colors.length > 0 ? colors[0] : null;
      
      setData({
        id: id,
        title: productData.name || productData.title || "Untitled Product",
        price: `₹${productData.discountPrice || productData.originalPrice || "0"}`,
        originalPrice: productData.originalPrice ? `₹${productData.originalPrice}` : null,
        discount: (productData.originalPrice && productData.discountPrice) 
          ? Math.round(((productData.originalPrice - productData.discountPrice) / productData.originalPrice) * 100) 
          : 0,
        colors: colors, // Store all colors
        colorName: initialColor, // Initial selected color name
        images: productData.images || ["https://via.placeholder.com/600x800?text=No+Image"],
        sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
        swatches: productData.images || [], 
        description: productData.description || 'No description available.',
        modelNote: productData.modelNote || 'Regular fit.',
        category: productData.category,
        subCategory: productData.subCategory
      });
      setSelectedColor(initialColor); // Set initial selected color
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleColorSelect = (color: string, index: number) => {
    setSelectedColor(color);
    setActiveImage(index);
    setData((prevData: any) => ({
      ...prevData,
      colorName: color,
    }));
  };

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size first!");
      return;
    }

    setIsAdding(true);
    addToCart({
      id: data.id,
      slug: slug as string,
      title: data.title,
      price: data.price,
      image: data.images[0],
      size: size,
      quantity: 1
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleBuyNow = () => {
    if (!size) {
      alert("Please select a size first!");
      return;
    }

    addToCart({
      id: data.id,
      slug: slug as string,
      title: data.title,
      price: data.price,
      image: data.images[0],
      size: size,
      quantity: 1
    });

    router.push('/cart');
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev + 1) % data.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev - 1 + data.images.length) % data.images.length);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold uppercase">Product Not Found</h2>
        <Link href="/" className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white uppercase">Go Home</Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl bg-white min-h-screen">
      {/* Full Screen Modal - Matching User Image 1 */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsFullScreen(false)}
        >
          <button 
            className="absolute top-6 left-6 p-2 text-black hover:scale-110 transition-transform z-[110]"
            onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={data.images[activeImage]}
            alt={data.title}
            className="max-h-full max-w-full object-contain"
          />

          {/* Left/Right Navigation in Full Screen */}
          <button 
            onClick={prevImage}
            className="absolute left-6 size-16 rounded-full bg-black/10 text-black flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-6 size-16 rounded-full bg-black/10 text-black flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_450px]">
        {/* Left Side: Image Gallery with Vertical Thumbnails */}
        <div className="relative flex flex-col-reverse lg:flex-row h-[85vh] lg:h-[calc(100vh-56px)] bg-[#F5F5F5]">
          {/* Vertical Thumbnails - Left Side on Desktop, Bottom on Mobile */}
          <div className="flex lg:flex-col gap-3 p-4 overflow-x-auto lg:overflow-y-auto lg:w-[100px] bg-white lg:bg-transparent">
            {data.images.map((src: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative flex-shrink-0 size-16 lg:size-20 overflow-hidden border-2 transition-all ${activeImage === i ? 'border-black' : 'border-transparent hover:border-zinc-300'}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image View */}
          <div 
            className="relative flex-1 overflow-hidden cursor-zoom-in"
            onClick={() => setIsFullScreen(true)}
          >
            <img
              src={data.images[activeImage]}
              alt={data.title}
              className="h-full w-full object-cover transition-transform duration-500"
            />

            {/* Left/Right Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
              <button 
                onClick={prevImage}
                className="size-10 rounded-full bg-black/20 text-white backdrop-blur-sm flex items-center justify-center pointer-events-auto hover:bg-black/40 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <button 
                onClick={nextImage}
                className="size-10 rounded-full bg-black/20 text-white backdrop-blur-sm flex items-center justify-center pointer-events-auto hover:bg-black/40 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Floating Actions */}
            <div className="absolute inset-0 p-4 flex flex-col pointer-events-none">
              <div className="flex justify-between items-start pointer-events-auto">
                <button 
                  onClick={() => router.back()}
                  className="p-2 text-black hover:scale-110 transition-transform bg-white/20 backdrop-blur-md rounded-full"
                  aria-label="Back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                
                <div className="flex flex-col gap-3 items-center">
                  <button className="p-2 text-black hover:scale-110 transition-transform bg-white/40 backdrop-blur-md rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <aside className="p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-tight">{data.title}</h1>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-black">{data.price}</span>
              {data.originalPrice && data.price !== data.originalPrice && (
                <>
                  <span className="text-sm text-zinc-500 line-through">{data.originalPrice}</span>
                  <span className="text-sm font-bold text-red-600 uppercase">Save {data.discount}%</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-400">MRP incl. of all taxes</p>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-widest text-zinc-400">Select Color</div>
            <div className="mt-4 flex items-center gap-3">
              {data.colors && data.colors.map((color: string, i: number) => (
                <button 
                  key={color} 
                  className={`size-12 rounded-full border-2 p-0.5 transition-all ${selectedColor === color ? 'border-black' : 'border-transparent hover:border-zinc-200'}`}
                  onClick={() => handleColorSelect(color, i)}
                >
                  {/* Assuming a simple color representation, or you can use a small image swatch */}
                  <div className="size-full rounded-full" style={{ backgroundColor: color.toLowerCase() }}></div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-800 uppercase tracking-tight">{data.colorName}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-widest text-zinc-400">Select Size</div>
              <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Size Guide</button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {data.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 text-sm font-black uppercase tracking-tighter border-2 transition-all ${size === s ? 'border-black bg-black text-white' : 'border-zinc-100 hover:border-black'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium text-zinc-500">{data.modelNote}</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full rounded-full py-5 text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${
                isAdding ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {isAdding ? 'Added to Bag!' : 'Add to Bag'}
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full rounded-full border-2 border-black py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-transform active:scale-95"
            >
              Buy Now
            </button>
          </div>

          {/* New Accordion Section (Matching User Image) */}
          <div className="pt-6 space-y-0">
            <div className="text-center py-4 text-sm font-medium tracking-tight text-zinc-800 border-t border-zinc-100">
              FREE 1-2 day delivery on 5k+ pincodes
            </div>
            
            {[
              { 
                id: 'details', 
                label: 'DETAILS',
                content: (
                  <div className="pb-6 space-y-6 text-[15px] leading-relaxed text-zinc-800">
                    <p>{data.description || "No description available."}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-black">Size & Fit</h4>
                        <p>Fit - {data.subCategory || "Regular Fit"}</p>
                        <p>Size - Model Is Wearing Size {data.sizes?.[0] || "32"}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-black text-black">Wash care</h4>
                        <p>Machine Wash</p>
                      </div>
                      
                      <div>
                        <h4 className="font-black text-black">Specification</h4>
                        <p>Pattern - Plain</p>
                        <p className="mt-4">SKU: 4TR022-05</p>
                      </div>
                    </div>
                  </div>
                )
              },
              { 
                id: 'reviews', 
                label: 'REVIEWS',
                content: (
                  <div className="pb-8">
                    <div className="flex border-b border-zinc-100">
                      <button className="flex-1 py-3 text-xs font-black tracking-widest border-b-2 border-red-500 text-black">STYLE REVIEWS</button>
                      <button className="flex-1 py-3 text-xs font-black tracking-widest text-zinc-400">CATEGORY REVIEWS</button>
                    </div>
                    <div className="mt-8 text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-black">4.3</span>
                        <div className="flex text-black">
                          {[1, 2, 3, 4].map((s) => (
                            <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-zinc-200">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[15px] font-medium text-zinc-800">
                        Loved by our users! <span className="font-black">20</span> out of <span className="font-black">41</span> rated 5 stars
                      </p>
                    </div>
                  </div>
                )
              },
              { 
                id: 'delivery', 
                label: 'DELIVERY',
                content: (
                  <div className="pb-6">
                    <div className="relative flex items-center border border-zinc-200 px-4 py-4 rounded-sm">
                      <input 
                        type="text" 
                        placeholder="Enter Pincode" 
                        className="flex-1 outline-none text-sm font-medium placeholder:text-zinc-300"
                      />
                      <button className="text-sm font-black text-zinc-600 hover:text-black transition-colors">APPLY</button>
                    </div>
                  </div>
                )
              },
              { 
                id: 'returns', 
                label: 'RETURNS',
                content: (
                  <div className="pb-8 space-y-4 text-[15px] font-medium text-zinc-800 leading-relaxed">
                    <div className="flex gap-3">
                      <span>1.</span>
                      <p>Hassle-free returns within 7 days under specific product and promotion conditions.</p>
                    </div>
                    <div className="flex gap-3">
                      <span>2.</span>
                      <p>Refunds for prepaid orders revert to the original payment method, while COD orders receive a wallet refund.</p>
                    </div>
                    <div className="flex gap-3">
                      <span>3.</span>
                      <p>Report defective, incorrect, or damaged items within 24 hours of delivery.</p>
                    </div>
                    <div className="flex gap-3">
                      <span>4.</span>
                      <p>Products bought during special promotions like BOGO are not eligible for returns.</p>
                    </div>
                    <div className="flex gap-3">
                      <span>5.</span>
                      <p>For excessive returns, reverse shipment fee upto Rs 100 can be charged, which will be deducted from the refund.</p>
                    </div>
                    <div className="flex gap-3">
                      <span>6.</span>
                      <p>Non-returnable items include accessories, sunglasses, perfumes, masks, and innerwear due to hygiene concerns.</p>
                    </div>
                  </div>
                )
              },
            ].map((item) => (
              <div key={item.id} className="border-t border-zinc-100">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between py-5 group transition-all"
                >
                  <span className="text-sm font-black uppercase tracking-widest text-zinc-900 group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                  <div className="relative size-6 flex items-center justify-center">
                    <div className={`absolute h-0.5 w-4 bg-black transition-all ${openAccordion === item.id ? 'rotate-0' : 'rotate-90'}`} />
                    <div className="absolute h-0.5 w-4 bg-black" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === item.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {item.content}
                </div>
              </div>
            ))}
            <div className="border-t border-zinc-100" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 hidden">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivery</div>
              <div className="text-sm font-bold">Standard Delivery</div>
              <div className="text-xs text-zinc-500">2-5 Business Days</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Returns</div>
              <div className="text-sm font-bold">Easy Returns</div>
              <div className="text-xs text-zinc-500">7 Day Return Policy</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
