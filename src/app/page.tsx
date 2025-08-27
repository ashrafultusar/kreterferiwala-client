import Slider from "@/components/Slider/Slider";
import AllCategories from "@/components/AllCategories/AllCategories";
import AllProducts from "@/components/HomePage/AllProducts/AllProducts";

export default async function Home() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_API;

  const [slidersRes, categoriesRes, productsRes] = await Promise.all([
    fetch(`${backend}/sliders`, { cache: "no-store" }),
    fetch(`${backend}/categories`, { cache: "no-store" }),
    fetch(`${backend}/products`, { cache: "no-store" }),
  ]);

  const [sliders, categories, products] = await Promise.all([
    slidersRes.json(),
    categoriesRes.json(),
    productsRes.json(),
  ]);

  return (
    <div className="flex flex-col min-h-screen mt-16 md:mt-40 lg:mt-32">
      <div className="w-full">
        <Slider data={sliders} />
      </div>
      <AllCategories data={categories} />
      <AllProducts data={products} />
    </div>
  );
}
